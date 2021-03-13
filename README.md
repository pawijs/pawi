# Pawi Visual Live Coding in VSCode

[![Build status][travis-image]][travis-url]
[![Commitizen friendly][commitizen-image]][commitizen-url]

A tool for live-coding using latest web technologies and Visual Studio Code.

![pawi-animation][animation-url]

Some information on the project on [dev.to][article-url].

[travis-image]: https://img.shields.io/travis/pawijs/pawi.svg?style=flat
[travis-url]: https://travis-ci.com/pawijs/pawi
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat
[commitizen-url]: http://commitizen.github.io/cz-cli/
[build-url]: https://github.com/tuist-org/tuist/tree/next/packages/@tuist/build
[build-image]: https://img.shields.io/npm/v/@tuist/build.svg?style=flat
[build-npm]: https://npmjs.org/package/@tuist/build
[article-url]: https://dev.to/maia_tae/visual-live-coding-proof-of-concept-1o7l
[animation-url]: https://user-images.githubusercontent.com/79422935/110322560-2e879380-8078-11eb-97d1-bb8e02bbf9fc.gif

## Core

- [![version number][vscode-version]][vscode-url] [![install count][vscode-count]][vscode-count-url]
  (VSCode extension)
- [![NPM version][snow-image]][snow-npm] [snowpack-pawi][snow-url]
  (Snowpack plugin for HMR live-coding)
- [![NPM version][pawi-image]][pawi-npm] [pawi][pawi-url]
  (Types)
- [![NPM version][pawi-link-image]][pawi-link-npm] [pawi-link][pawi-link-url]
  (Linker)

## Libraries

- [![NPM version][base-image]][base-npm] [@pawi/base][base-url]
  (Basic blocks: animation setup, midi)
- [![NPM version][three-image]][three-npm] [@pawi/three][three-url]
  (Three.js blocks: 3D programming)

# What is Pawi ?

[Pawi](http://pawijs.org/) is a set of tools, libraries and editor helpers
to make the creation of delicate and complex visuals simpler and faster by
enabling:

1. Code reuse (once a block is created, it can easily be reused in new projects, stable inter-block API)
2. Code sharing (publishing blocks as npm package for others to use)
3. Stability (library versions locked with npm, versioning, clear API surfaces)
4. Fast feedback loop (live coding, visual programming)

The project uses the latest web technologies and tries to have the lowest possible
impact on performance (a function call).

[vscode-version]: https://vsmarketplacebadge.apphb.com/version-short/pawijs.vscode-pawi.svg
[vscode-url]: https://marketplace.visualstudio.com/items?itemName=pawijs.vscode-pawi
[vscode-count]: https://vsmarketplacebadge.apphb.com/installs-short/pawijs.vscode-pawi.svg
[vscode-count-url]: https://marketplace.visualstudio.com/items?itemName=pawijs.vscode-pawi
[snow-url]: https://github.com/pawijs/pawi/tree/next/packages/snowpack-pawi
[snow-image]: https://img.shields.io/npm/v/snowpack-pawi.svg?style=flat
[snow-npm]: https://npmjs.org/package/snowpack-pawi
[pawi-url]: https://github.com/pawijs/pawi/tree/next/packages/pawi
[pawi-image]: https://img.shields.io/npm/v/pawi.svg?style=flat
[pawi-npm]: https://npmjs.org/package/pawi
[pawi-link-url]: https://github.com/pawijs/pawi/tree/next/packages/pawi-link
[pawi-link-image]: https://img.shields.io/npm/v/pawi-link.svg?style=flat
[pawi-link-npm]: https://npmjs.org/package/pawi-link
[base-url]: https://github.com/pawijs/pawi/tree/next/packages/@pawi/base
[base-image]: https://img.shields.io/npm/v/@pawi/base.svg?style=flat
[base-npm]: https://npmjs.org/package/@pawi/base
[three-url]: https://github.com/pawijs/pawi/tree/next/packages/@pawi/three
[three-image]: https://img.shields.io/npm/v/@pawi/three.svg?style=flat
[three-npm]: https://npmjs.org/package/@pawi/three

# Getting started

1. Install VSCode extension **Pawi**
2. Clone [sample project][sample-url]
3. Install dependencies
4. Start server: `npm run serve` and choose an example
5. Open project in vscode
6. In VSCode, open the corresponding file `src/[example]/branch.o.json`
7. Open hamburger for library and start editing or edit some existing blocks.

If you find this interesting, say hello :-) [@maia_tae][twitter-url]

[sample-url]: https://github.com/pawijs/sample-project
[twitter-url]: https://twitter.com/maia_tae
