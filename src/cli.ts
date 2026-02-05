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
    .option('--dependents', 'Show dependents for each version')
    .command('[lockfile]', 'Find multiple versions packages in pnpm-lock.yaml')
    .action(run)
  cli.parse()
}

async function run(
  file: string | undefined,
  {
    ignoreMajor,
    dependents,
  }: { ignoreMajor?: boolean; dependents?: boolean } = {},
) {
  const filePath = file || findUp('pnpm-lock.yaml')
  if (!filePath) {
    console.error(styleText('red', `pnpm-lock.yaml not found!`))
    process.exit(1)
  }
  const lockfile = await readLockfile(filePath)
  const { versionsMap, dependentsMap, multipleVersions } = pnpmMultiVersions(
    lockfile,
    {
      ignoreMajor: !!ignoreMajor,
      dependents: !!dependents,
    },
  )

  if (multipleVersions.length === 0) {
    console.log(styleText('green', `No multiple versions packages found!`))
    return
  }

  console.info(`Multiple versions packages (${multipleVersions.length}):\n`)

  if (dependents && dependentsMap) {
    printDependentsTree(multipleVersions, versionsMap, dependentsMap)
  } else {
    printSummary(multipleVersions, versionsMap)
  }
}

export function printSummary(
  multipleVersions: string[],
  versionsMap: Map<string, Set<string>>,
): void {
  const maxLength = Math.max(...multipleVersions.map((pkg) => pkg.length))
  for (const pkg of multipleVersions) {
    console.log(
      `${styleText('blue', pkg.padStart(maxLength))}:`,
      [...versionsMap.get(pkg)!].join(', '),
    )
  }
}

export function printDependentsTree(
  multipleVersions: string[],
  versionsMap: Map<string, Set<string>>,
  dependentsMap: Map<string, Map<string, Set<string>>>,
): void {
  const isSinglePackage = multipleVersions.length === 1

  for (let i = 0; i < multipleVersions.length; i++) {
    const isFirst = i === 0
    const isLast = i === multipleVersions.length - 1

    const pkg = multipleVersions[i]
    const versions = [...versionsMap.get(pkg)!].toSorted()
    const prefix = isLast ? '   ' : '│  '

    if (isSinglePackage) {
      console.log(styleText('blue', pkg))
    } else {
      console.log(
        `${isFirst ? '┌─' : isLast ? '└─' : '├─'} ${styleText('blue', pkg)}`,
      )
    }

    for (let j = 0; j < versions.length; j++) {
      const version = versions[j]
      const isLastVer = j === versions.length - 1
      const treePrefix = isLastVer ? '└─' : '├─'

      const deps = dependentsMap?.get(pkg)?.get(version)
      const versionPrefix = isSinglePackage ? '' : prefix
      let versionLine = `${versionPrefix}${treePrefix} ${styleText('yellow', version)}`

      if (deps && deps.size > 0) {
        const depList = [...deps].toSorted()
        const depStr = depList.join(', ')
        versionLine += `  ${styleText('gray', depStr)}`
      }

      console.log(versionLine)
    }
  }
}
