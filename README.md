# pnpm-multi-versions [![npm](https://img.shields.io/npm/v/pnpm-multi-versions.svg)](https://npmjs.com/package/pnpm-multi-versions)

[![Unit Test](https://github.com/sxzz/pnpm-multi-versions/actions/workflows/unit-test.yml/badge.svg)](https://github.com/sxzz/pnpm-multi-versions/actions/workflows/unit-test.yml)

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
