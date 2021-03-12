# Pawi Visual Live Coding in VSCode

[![Build status][travis-image]][travis-url]
[![Commitizen friendly][commitizen-image]][commitizen-url]

A tool for live-coding using latest web technologies and Visual Studio Code.

![pawi-animation][animation-url]

Some information on the project on [dev.to][article-url].

## Exploring

1. Install VSCode extension **Pawi**
2. Clone [sample project][sample-url]
3. Install dependencies
4. Start server: `npm run serve` and choose an example
5. Open project in vscode
6. In VSCode, open the corresponding file `src/[example]/branch.o.json`
7. Open hamburger for library and start editing or edit some existing blocks.

If you find this interesting, say hello :-) [@maia_tae][twitter-url]

# Published modules

- [![version number][vscode-version]][vscode-url] [![install count][vscode-count]][vscode-count-url]
  (VSCode extension)
- [![NPM version][snow-image]][snow-npm] [snowpack-pawi][snow-url]
  (Snowpack plugin for smooth code reloding)
- [![NPM version][pawi-image]][pawi-npm] [pawi][pawi-url]
  (Runtime)
- [![NPM version][base-image]][base-npm] [@pawi/base][base-url]
  (Basic blocks: animation setup, midi)
- [![NPM version][three-image]][three-npm] [@pawi/three][three-url]
  (Three.js blocks: 3D programming)

[snow-url]: https://github.com/pawijs/pawi/tree/next/packages/node_modules/snowpack-pawi
[snow-image]: https://img.shields.io/npm/v/snowpack-pawi.svg?style=flat
[snow-npm]: https://npmjs.org/package/snowpack-pawi
[pawi-url]: https://github.com/pawijs/pawi/tree/next/packages/node_modules/pawi
[pawi-image]: https://img.shields.io/npm/v/pawi.svg?style=flat
[pawi-npm]: https://npmjs.org/package/pawi
[base-url]: https://github.com/pawijs/pawi/tree/next/packages/node_modules/@pawi/base
[base-image]: https://img.shields.io/npm/v/@pawi/base.svg?style=flat
[base-npm]: https://npmjs.org/package/@pawi/base
[three-url]: https://github.com/pawijs/pawi/tree/next/packages/node_modules/@pawi/three
[three-image]: https://img.shields.io/npm/v/@pawi/three.svg?style=flat
[three-npm]: https://npmjs.org/package/@pawi/three

# Internal

These are some notes for maintainers, published here because getting this wrong makes a mess :-)

### Release process

Review and merge PRs into `next` branch. To release a production ready version, you need
to add the commits from `next` to `master` with the following (github web interface does not
work as it makes branches diverge):

```sh
$ git checkout next
$ git pull
$ npm install # make sure any new dependencies are installed
$ npm install --no-save nodegit # needed to test release
$ npm run release -- --dry-run # and check release notes
$ git checkout master
$ git pull
$ git merge --ff-only next
$ git push
```
