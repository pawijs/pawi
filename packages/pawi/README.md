# pawi

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]

[npm-image]: https://img.shields.io/npm/v/pawi.svg?style=flat
[npm-url]: https://npmjs.org/package/pawi
[travis-image]: https://img.shields.io/travis/pawijs/pawi.svg?style=flat
[travis-url]: https://travis-ci.com/pawijs/pawi

Types and linker for [Pawi](http://pawijs.org).

The types in this package act as semver "contract" and drive major semver
version bump on dependent packages in case the Block API changes. It is an
important piece to ensure stability of the work done with pawi and ensures
that the linker, UI, libraries and all the projects based on pawi work
together seamlessly.

The linker part of this package builds an executable from a branch definition.

See [sample-project](https://github.com/pawijs/sample-project) for an example.

```sh
npm install --save pawi
```
