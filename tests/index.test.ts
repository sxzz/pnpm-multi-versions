import { expect, test } from 'vitest'
import { pnpmMultiVersions, readLockfile } from '../src'

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
