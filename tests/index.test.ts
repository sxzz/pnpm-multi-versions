import { expect, test } from 'vitest'
import { pnpmMultiVersions, readLockfile } from '../src'

test('basic', async () => {
  const lockfile = await readLockfile('pnpm-lock.yaml')
  const { versionsMap, multipleVersions } = pnpmMultiVersions(lockfile)

  expect(versionsMap.get('yaml')?.size).toBe(1)

  const firstMulti = [...multipleVersions][0]
  expect(versionsMap.get(firstMulti)?.size).greaterThan(1)
})
