# pawi

(rename of **tuist** project)

[![Build status][travis-image]][travis-url]
[![Commitizen friendly][commitizen-image]][commitizen-url]

[travis-image]: https://img.shields.io/travis/pawijs/pawi.svg?style=flat
[travis-url]: https://travis-ci.org/pawijs/pawi
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat
[commitizen-url]: http://commitizen.github.io/cz-cli/

To explore a **pawi** project, clone [sample-project][sample-url].

## What is this ?

A tool for live-coding using latest web technologies and Visual Studio Code.

This repository also contains the Overmind helper modules needed to create
the live editor. The helpers are published as separate npm packages and
maintained by **pawijs**.

Some information on the project on [dev.to](https://dev.to/maia_tae/visual-live-coding-proof-of-concept-1o7l)

![Screen Shot 2021-03-06 at 12 48 00 PM](https://user-images.githubusercontent.com/79422935/110215961-6cb76400-7e7a-11eb-8bd0-ae03060a9b7a.png)

Say hello [@maia_tae](https://twitter.com/maia_tae).

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
[three-url]: https://github.com/pawijs/pawi/tree/next/packages/@pawi/three
[three-image]: https://img.shields.io/npm/v/@pawi/three.svg?style=flat
[three-npm]: https://npmjs.org/package/@pawi/three

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
