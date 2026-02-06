import { readFile } from 'node:fs/promises'
import { parse } from 'yaml'

export interface LockfileObject {
  lockfileVersion: string
  packages: Record<string, unknown>
  snapshots?: Record<
    string,
    { dependencies?: Record<string, string> } | unknown
  >
}

export async function readLockfile(filePath: string): Promise<LockfileObject> {
  const raw = await readFile(filePath, 'utf8')
  return parse(raw)
}

// "eslint@9.39.2(jiti@2.6.1)" → "eslint@9.39.2"
// "@types/node@25.2.0(eslint@9.39.2(...))" → "@types/node@25.2.0"
const PACKAGE_PATH_PATTERN = /^(.+?@\d+\.\d+\.\d[^(:]*)/
// "9.39.2(jiti@2.6.1)" → "9.39.2"
// "8.0.0-beta.4(eslint@9.39.2(...))" → "8.0.0-beta.4"
const VERSION_PATTERN = /^(\d+\.\d+\.\d+(?:-[a-z0-9.]+)?)/i

export function pnpmMultiVersions(
  lockfile: LockfileObject,
  {
    ignoreMajor,
    dependents,
  }: {
    /** Ignore major version difference */
    ignoreMajor?: boolean
    /** Show dependents for each version */
    dependents?: boolean
  } = {},
): {
  versionsMap: Map<string, Set<string>>
  dependentsMap?: Map<string, Map<string, Set<string>>>
  multipleVersions: string[]
} {
  const { lockfileVersion } = lockfile
  if (typeof lockfileVersion !== 'string' || lockfileVersion[0] !== '9') {
    throw new Error(`Only support pnpm v9 lockfile, but got ${lockfileVersion}`)
  }

  const pkgs = Object.keys(lockfile.packages || {})
  const versionsMap = new Map<string, Set<string>>()
  const dependentsMap = new Map<string, Map<string, Set<string>>>()
  const multipleVersions = new Set<string>()

  for (const pkg of pkgs) {
    const names = pkg.split('@')
    const version = names.pop()!
    let name = names.join('@')
    if (ignoreMajor) {
      const major = version.split('.')[0]
      name += `@${major}`
    }

    if (versionsMap.has(name)) {
      const vers = versionsMap.get(name)!
      vers.add(version)
      if (vers.size > 1) multipleVersions.add(name)
    } else {
      versionsMap.set(name, new Set([version]))
    }
  }

  if (dependents && lockfile.snapshots) {
    const snapshots = lockfile.snapshots as Record<
      string,
      { dependencies?: Record<string, string> }
    >

    for (const [pkgPath, snapshot] of Object.entries(snapshots)) {
      if (
        snapshot &&
        typeof snapshot === 'object' &&
        'dependencies' in snapshot &&
        snapshot.dependencies
      ) {
        const deps = snapshot.dependencies
        const cleanPkgPath = pkgPath.match(PACKAGE_PATH_PATTERN)?.[1] || pkgPath

        for (const [depName, depVersion] of Object.entries(deps)) {
          if (!dependentsMap.has(depName)) {
            dependentsMap.set(depName, new Map())
          }

          const depVersions = dependentsMap.get(depName)!
          const cleanVersion =
            depVersion.match(VERSION_PATTERN)?.[1] || depVersion

          if (!depVersions.has(cleanVersion)) {
            depVersions.set(cleanVersion, new Set())
          }
          depVersions.get(cleanVersion)!.add(cleanPkgPath)
        }
      }
    }
  }

  return {
    versionsMap,
    dependentsMap: dependents ? dependentsMap : undefined,
    multipleVersions: [...multipleVersions],
  }
}
