import { beforeEach, describe, expect, it, vi } from 'vitest'
import { printDependentsTree } from '../src/cli.ts'

describe('printDependentsTree', () => {
  beforeEach(() => {
    vi.stubGlobal('console', {
      log: vi.fn(),
      info: vi.fn(),
      error: vi.fn(),
    })
  })

  it('single package', () => {
    const versionsMap = new Map<string, Set<string>>([
      ['pkg-a', new Set(['1.0.0', '2.0.0'])],
    ])

    const dependentsMap = new Map<string, Map<string, Set<string>>>([
      [
        'pkg-a',
        new Map([
          ['1.0.0', new Set(['dep-1', 'dep-2'])],
          ['2.0.0', new Set(['dep-3'])],
        ]),
      ],
    ])

    printDependentsTree(['pkg-a'], versionsMap, dependentsMap)

    // @ts-expect-error - console is mocked
    const calls = console.log.mock.calls.map((call) => call[0])

    expect(calls).toMatchInlineSnapshot(`
      [
        "pkg-a",
        "├─ 1.0.0  dep-1, dep-2",
        "└─ 2.0.0  dep-3",
      ]
    `)
  })

  it('two packages', () => {
    const versionsMap = new Map<string, Set<string>>([
      ['pkg-a', new Set(['1.0.0', '2.0.0'])],
      ['pkg-b', new Set(['1.5.0'])],
    ])

    const dependentsMap = new Map<string, Map<string, Set<string>>>([
      [
        'pkg-a',
        new Map([
          ['1.0.0', new Set(['dep-1', 'dep-2'])],
          ['2.0.0', new Set(['dep-3'])],
        ]),
      ],
      ['pkg-b', new Map([['1.5.0', new Set(['dep-4', 'dep-5', 'dep-6'])]])],
    ])

    printDependentsTree(['pkg-a', 'pkg-b'], versionsMap, dependentsMap)

    // @ts-expect-error - console is mocked
    const calls = console.log.mock.calls.map((call) => call[0])

    expect(calls).toMatchInlineSnapshot(`
      [
        "┌─ pkg-a",
        "│  ├─ 1.0.0  dep-1, dep-2",
        "│  └─ 2.0.0  dep-3",
        "└─ pkg-b",
        "   └─ 1.5.0  dep-4, dep-5, dep-6",
      ]
    `)
  })
})
