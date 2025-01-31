import process from 'node:process'
import { findUp } from 'find-up-simple'
import pc from 'picocolors'
import { pnpmMultiVersions, readLockfile } from './index'

export async function runCLI(): Promise<void> {
  const filePath = await findUp('pnpm-lock.yaml')
  if (!filePath) {
    console.error(pc.red('pnpm-lock.yaml not found!'))
    process.exit(1)
  }
  const lockfile = await readLockfile(filePath)
  const { versionsMap, multipleVersions } = pnpmMultiVersions(lockfile)

  if (multipleVersions.length === 0) {
    console.log(pc.green('No multiple versions packages found!'))
    return
  }

  console.info(`Multiple versions packages (${multipleVersions.length}):\n`)

  const maxLength = Math.max(...multipleVersions.map((pkg) => pkg.length))
  for (const pkg of multipleVersions) {
    console.log(
      `${pc.blue(pkg.padStart(maxLength))}:`,
      [...versionsMap.get(pkg)!].join(', '),
    )
  }
}
