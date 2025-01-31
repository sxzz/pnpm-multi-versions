import { readFile } from 'node:fs/promises'
import { parse } from 'yaml'
import type { LockfileObject } from '@pnpm/lockfile.types'

export type { LockfileObject }

export async function readLockfile(filePath: string): Promise<LockfileObject> {
  const raw = await readFile(filePath, 'utf8')
  return parse(raw)
}

export function pnpmMultiVersions(
  lockfile: LockfileObject,
  {
    ignoreMajor,
  }: {
    /** Ignore major version difference */
    ignoreMajor?: boolean
  } = {},
): {
  versionsMap: Map<string, Set<string>>
  multipleVersions: Set<string>
} {
  const { lockfileVersion } = lockfile
  if (typeof lockfileVersion !== 'string' || lockfileVersion[0] !== '9') {
    throw new Error(`Only support pnpm v9 lockfile, but got ${lockfileVersion}`)
  }
  const pkgs = Object.keys(lockfile.packages || {})
  const versionsMap = new Map<string, Set<string>>()
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

  return {
    versionsMap,
    multipleVersions,
  }
}
