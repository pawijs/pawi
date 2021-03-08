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
7. Open hamburger for library and start editing...

If you find this interesting, say hello :-) [@maia_tae][twitter-url]

# Published modules

- [![version number][vscode-version]][vscode-url] [![install count][vscode-count]][vscode-count-url]
  (VSCode **Pawi** extension)

- [![NPM version][pawi-image]][pawi-npm] [pawi][pawi-url]
  (live coding runtime)
- [![NPM version][base-image]][base-npm] [@pawi/base][base-url]
  (basic blocks: animation setup, midi)
- [![NPM version][three-image]][three-npm] [@pawi/three][three-url]
  (Three.js blocks: 3D programming)

[base-url]: https://github.com/pawijs/pawi/tree/next/packages/@pawi/base
[base-image]: https://img.shields.io/npm/v/@pawi/base.svg?style=flat
[base-npm]: https://npmjs.org/package/@pawi/base
[pawi-url]: https://github.com/pawijs/pawi/tree/next/packages/pawi
[pawi-image]: https://img.shields.io/npm/v/pawi.svg?style=flat
[pawi-npm]: https://npmjs.org/package/pawi
[three-url]: https://github.com/pawijs/pawi/tree/next/packages/@pawi/three
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

[travis-image]: https://img.shields.io/travis/pawijs/pawi.svg?style=flat
[travis-url]: https://travis-ci.org/pawijs/pawi
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat
[commitizen-url]: http://commitizen.github.io/cz-cli/
[animation-url]: https://user-images.githubusercontent.com/79422935/110322560-2e879380-8078-11eb-97d1-bb8e02bbf9fc.gif
[sample-url]: https://github.com/pawijs/sample-project
[twitter-url]: https://twitter.com/maia_tae
[article-url]: https://dev.to/maia_tae/visual-live-coding-proof-of-concept-1o7l
[vscode-version]: https://vsmarketplacebadge.apphb.com/version-short/pawijs.vscode-pawi.svg
[vscode-url]: https://marketplace.visualstudio.com/items?itemName=pawijs.vscode-pawi
[vscode-count]: https://vsmarketplacebadge.apphb.com/installs-short/pawijs.vscode-pawi.svg
[vscode-count-url]: https://marketplace.visualstudio.com/items?itemName=pawijs.vscode-pawi
