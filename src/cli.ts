import process from 'node:process'
import { findUp } from 'find-up-simple'
import pc from 'picocolors'
import { pnpmMultiVersions } from './index'

export async function runCLI(): Promise<void> {
  const filePath = await findUp('pnpm-lock.yaml')
  if (!filePath) {
    console.error(pc.red('pnpm-lock.yaml not found!'))
    process.exit(1)
  }
  const { versionsMap, multipleVersions } = await pnpmMultiVersions(filePath)

  if (multipleVersions.size === 0) {
    console.log(pc.green('No multiple versions packages found!'))
    return
  }

  console.info('Multiple versions packages:\n')

  const maxLenth = Math.max(...[...multipleVersions].map((pkg) => pkg.length))
  for (const pkg of multipleVersions) {
    console.log(
      `${pc.blue(pkg.padStart(maxLenth))}:`,
      [...versionsMap.get(pkg)!].join(', '),
    )
  }
}
