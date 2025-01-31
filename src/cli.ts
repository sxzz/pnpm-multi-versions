import process from 'node:process'
import { cac } from 'cac'
import { findUp } from 'find-up-simple'
import pc from 'picocolors'
import { version } from '../package.json'
import { pnpmMultiVersions, readLockfile } from './index'

export function runCLI(): void {
  const cli = cac('pnpm-multi-versions')
  cli.help().version(version)
  cli
    .option('--ignore-major', 'Ignore major version difference')
    .command('[lockfile]', 'Find multiple versions packages in pnpm-lock.yaml')
    .action(run)
  cli.parse()
}

async function run(
  file: string | undefined,
  { ignoreMajor }: { ignoreMajor?: boolean } = {},
) {
  const filePath = file || (await findUp('pnpm-lock.yaml'))
  if (!filePath) {
    console.error(pc.red('pnpm-lock.yaml not found!'))
    process.exit(1)
  }
  const lockfile = await readLockfile(filePath)
  const { versionsMap, multipleVersions } = pnpmMultiVersions(lockfile, {
    ignoreMajor: !!ignoreMajor,
  })

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
