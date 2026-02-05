# pnpm-multi-versions

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Unit Test][unit-test-src]][unit-test-href]

Find multiple versions of dependencies from pnpm lockfile.

## Install

```bash
npm i pnpm-multi-versions
```

## Usage

### CLI

```bash
pnpx pnpm-multi-versions

# Multiple versions packages:
#   pkg-types: 1.3.1, 2.3.0
#   quansync: 0.2.11, 1.0.0

# Show dependents for each version
pnpx pnpm-multi-versions --dependents

# Single package:
# pkg-types
# ├─ 1.3.1  mlly@1.8.0
# └─ 2.3.0  c12@3.3.3, local-pkg@1.1.2, nypm@0.6.2
#
# Multiple packages:
# ┌─ pkg-types
# │  ├─ 1.3.1  mlly@1.8.0
# │  └─ 2.3.0  c12@3.3.3, local-pkg@1.1.2, nypm@0.6.2
# └─ quansync
#    ├─ 0.2.11  local-pkg@1.1.2
#    └─ 1.0.0  @quansync/fs@1.0.0, unconfig-core@7.4.2

```

### API

```js
const lockfile = await readLockfile('pnpm-lock.yaml')
const { versionsMap, dependentsMap, multipleVersions } = pnpmMultiVersions(lockfile, {
  /** Ignore major version difference */
  ignoreMajor: false,
  /** Show dependents for each version */
  dependents: true,
})

console.log(versionsMap)
// Map(2) {
//   "pkg-types" => Set(2) { '1.3.1', '2.3.0' },
//   "quansync" => Set(2) { '0.2.11', '1.0.0' },
//   ...
// }

console.log(dependentsMap)
// Map(2) {
//   "pkg-types" => Map(2) {
//     "1.3.1" => Set(1) { 'mlly@1.8.0' },
//     "2.3.0" => Set(3) { 'c12@3.3.3', 'local-pkg@1.1.2', 'nypm@0.6.2' }
//   },
//   "quansync" => Map(2) {
//     "0.2.11" => Set(1) { 'local-pkg@1.1.2' },
//     "1.0.0" => Set(2) { '@quansync/fs@1.0.0', 'unconfig-core@7.4.2' }
//   }
// }

console.log(multipleVersions)
// Set(2) { 'pkg-types', 'quansync' }
```

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2025 [Kevin Deng](https://github.com/sxzz)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/pnpm-multi-versions.svg
[npm-version-href]: https://npmjs.com/package/pnpm-multi-versions
[npm-downloads-src]: https://img.shields.io/npm/dm/pnpm-multi-versions
[npm-downloads-href]: https://www.npmcharts.com/compare/pnpm-multi-versions?interval=30
[unit-test-src]: https://github.com/sxzz/pnpm-multi-versions/actions/workflows/unit-test.yml/badge.svg
[unit-test-href]: https://github.com/sxzz/pnpm-multi-versions/actions/workflows/unit-test.yml
