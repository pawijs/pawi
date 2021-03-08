# pawi

(rename of **tuist** project)

[![Build status][travis-image]][travis-url]
[![Commitizen friendly][commitizen-image]][commitizen-url]

To explore a **pawi** project, clone [sample-project][sample-url].

## What is this ?

A tool for live-coding using latest web technologies and Visual Studio Code.

## Exploring

1. Install VSCode extension [**Pawi**][vscode-url]
2. Clone [sample project][sample-url]
3. Install dependencies
4. Start server: `npm run serve` and choose an example
5. Open project in vscode
6. In VSCode, open the corresponding file `src/[example]/branch.o.json`
7. Open hamburger for library and start editing...

Some information on the project on [dev.to][article-url]

![pawi-animation][animation-url]

Say hello [@maia_tae][twitter-url]

## Pawi

- [![NPM version][pawi-image]][pawi-npm] [pawi][pawi-url]
  (live coding runtime)

## Pawi blocks library

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

[vscode-url]:
