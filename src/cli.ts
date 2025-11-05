import process from 'node:process'
import { styleText } from 'node:util'
import { cac } from 'cac'
import { up as findUp } from 'empathic/find'
import pkg from '../package.json' with { type: 'json' }
import { pnpmMultiVersions, readLockfile } from './index.ts'

export function runCLI(): void {
  const cli = cac('pnpm-multi-versions')
  cli.help().version(pkg.version)
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
  const filePath = file || findUp('pnpm-lock.yaml')
  if (!filePath) {
    console.error(styleText('red', `pnpm-lock.yaml not found!`))
    process.exit(1)
  }
  const lockfile = await readLockfile(filePath)
  const { versionsMap, multipleVersions } = pnpmMultiVersions(lockfile, {
    ignoreMajor: !!ignoreMajor,
  })

  if (multipleVersions.length === 0) {
    console.log(styleText('green', `No multiple versions packages found!`))
    return
  }

  console.info(`Multiple versions packages (${multipleVersions.length}):\n`)

  const maxLength = Math.max(...multipleVersions.map((pkg) => pkg.length))
  for (const pkg of multipleVersions) {
    console.log(
      `${styleText('blue', pkg.padStart(maxLength))}:`,
      [...versionsMap.get(pkg)!].join(', '),
    )
  }
}
