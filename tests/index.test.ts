import { expect, test } from 'vitest'
import { pnpmMultiVersions, readLockfile } from '../src/index.ts'

const lockfile = await readLockfile('pnpm-lock.yaml')

test('basic', () => {
  const { versionsMap, multipleVersions } = pnpmMultiVersions(lockfile)

  expect(versionsMap.get('yaml')?.size).toBe(1)

  const [firstMulti] = multipleVersions
  expect(versionsMap.get(firstMulti)?.size).greaterThan(1)
})

test('ignore major', () => {
  const { versionsMap, multipleVersions } = pnpmMultiVersions(lockfile, {
    ignoreMajor: true,
  })
  expect(multipleVersions).not.contains('debug')
  expect(multipleVersions.some((p) => p.startsWith('debug@'))).toBe(false)
  expect(
    [...versionsMap.keys()].filter((p) =>
      p.startsWith('escape-string-regexp@'),
    ),
  ).toHaveLength(3)
})

test('dependents without dependents option', () => {
  const { dependentsMap } = pnpmMultiVersions(lockfile)

  expect(dependentsMap).toBeUndefined()
})

test('dependents with lockfile without snapshots', () => {
  const lockfileWithoutSnapshots = {
    lockfileVersion: '9.0',
    packages: lockfile.packages,
  }

  const { dependentsMap } = pnpmMultiVersions(lockfileWithoutSnapshots, {
    dependents: true,
  })

  expect(dependentsMap).toBeInstanceOf(Map)
  expect(dependentsMap!.size).toBe(0)
})

test('dependents map', () => {
  const { dependentsMap } = pnpmMultiVersions(lockfile, {
    dependents: true,
  })
  expect(dependentsMap?.get('quansync')?.size).toBe(2)
  expect(dependentsMap?.get('quansync')?.get('1.0.0')?.size).toBe(2)
})
