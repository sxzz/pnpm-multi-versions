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
#   debug: 3.2.7, 4.4.0
```

### API

```js
const lockfile = await readLockfile('pnpm-lock.yaml')
const { versionsMap, multipleVersions } = pnpmMultiVersions(lockfile, {
  /** Ignore major version difference */
  ignoreMajor: false,
})

console.log(versionsMap)
// Map(1) {
//   "debug" => Set(2) { '3.2.7', '4.4.0' },
//   "ms" => Set(1) { '2.1.2' },
//   ...
// }

console.log(multipleVersions)
// Set(1) { 'debug' }
```

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2025 [三咲智子 Kevin Deng](https://github.com/sxzz)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/pnpm-multi-versions.svg
[npm-version-href]: https://npmjs.com/package/pnpm-multi-versions
[npm-downloads-src]: https://img.shields.io/npm/dm/pnpm-multi-versions
[npm-downloads-href]: https://www.npmcharts.com/compare/pnpm-multi-versions?interval=30
[unit-test-src]: https://github.com/sxzz/pnpm-multi-versions/actions/workflows/unit-test.yml/badge.svg
[unit-test-href]: https://github.com/sxzz/pnpm-multi-versions/actions/workflows/unit-test.yml
