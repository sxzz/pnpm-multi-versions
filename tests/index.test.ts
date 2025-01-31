import { expect, test } from 'vitest'
import { pnpmMultiVersions } from '../src'

test('basic', async () => {
  const { versionsMap, multipleVersions } =
    await pnpmMultiVersions('pnpm-lock.yaml')

  expect(versionsMap.get('yaml')?.size).toBe(1)

  const firstMulti = [...multipleVersions][0]
  expect(versionsMap.get(firstMulti)?.size).greaterThan(1)
})
