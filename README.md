# tuist

[![Build status][travis-image]][travis-url]
[![Commitizen friendly][commitizen-image]][commitizen-url]

[travis-image]: https://img.shields.io/travis/tuist-org/tuist.svg?style=flat
[travis-url]: https://travis-ci.org/tuist-org/tuist
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat
[commitizen-url]: http://commitizen.github.io/cz-cli/

To explore a **tuist** project, clone [sample-project][sample-url].

## What is this ?

A tool for live-coding using latest web technologies.

This repository also contains all the Overmind helper modules needed to
create the live editor. The helpers are published as separate npm packages and
maintained by **tuist-org**.

Some information on the project on [dev.to](https://dev.to/maia_tae/visual-live-coding-proof-of-concept-1o7l)

![Screen Shot 2021-02-27 at 6 48 01 PM](https://user-images.githubusercontent.com/79422935/109376981-0e93f980-792d-11eb-97a3-5978224e8642.png)

Say hello [@maia_tae](https://twitter.com/maia_tae).

## Tuist

- [![NPM version][tuist-image]][tuist-npm] [tuist][tuist-url]
  (live coding runtime)

## Packages used by editor

These packages are helpers to build Overmind apps (on which the vscode editor is based).

- [![NPM version][build-image]][build-npm] [@tuist/build][build-url]
  (modularity for building modular apps)
- [![NPM version][code-editor-image]][code-editor-npm] [@tuist/code-editor][code-editor-url]
  (code editor based on CodeMirror with scrubbing)
- [![NPM version][dragdrop-image]][dragdrop-npm] [@tuist/dragdrop][dragdrop-url]
  (drag and drop support)
- [![NPM version][editor-image]][editor-npm] [@tuist/editor][editor-url]
  (WYSIWYG editor)
- [![NPM version][locale-image]][locale-npm] [@tuist/locale][locale-url]
  (internationalization)
- [![NPM version][preferences-image]][preferences-npm] [@tuist/preferences][preferences-url]
  (user UI state persistance)
- [![NPM version][shortcuts-image]][shortcuts-npm] [@tuist/shortcuts][shortcuts-url]
  (keyboard shortcuts)
- [![NPM version][story-image]][story-npm] [@tuist/story][story-url]
  (storybook to help develop components)
- [![NPM version][styled-image]][styled-npm] [@tuist/styled][styled-url]
  (basic components)
- [![NPM version][theme-image]][theme-npm] [@tuist/theme][theme-url]
  (theming support)
- [![NPM version][tree-image]][tree-npm] [@tuist/tree][tree-url]
  (root-tree definition and methods)
- [![NPM version][tree-view-image]][tree-view-npm] [@tuist/tree-view][tree-view-url]
  (visual composer for root-tree structures)
- [![NPM version][useragent-image]][useragent-npm] [@tuist/useragent][useragent-url]
  (detect useragent, online, offline and other helpers)

[build-url]: https://github.com/tuist-org/tuist/tree/next/packages/@tuist/build
[build-image]: https://img.shields.io/npm/v/@tuist/build.svg?style=flat
[build-npm]: https://npmjs.org/package/@tuist/build
[code-editor-url]: https://github.com/tuist-org/tuist/tree/next/packages/@tuist/code-editor
[code-editor-image]: https://img.shields.io/npm/v/@tuist/code-editor.svg?style=flat
[code-editor-npm]: https://npmjs.org/package/@tuist/code-editor
[dragdrop-url]: https://github.com/tuist-org/tuist/tree/next/packages/@tuist/dragdrop
[dragdrop-image]: https://img.shields.io/npm/v/@tuist/dragdrop.svg?style=flat
[dragdrop-npm]: https://npmjs.org/package/@tuist/dragdrop
[editor-url]: https://github.com/tuist-org/tuist/tree/next/packages/@tuist/editor
[editor-image]: https://img.shields.io/npm/v/@tuist/editor.svg?style=flat
[editor-npm]: https://npmjs.org/package/@tuist/editor
[locale-url]: https://github.com/tuist-org/tuist/tree/next/packages/@tuist/locale
[locale-image]: https://img.shields.io/npm/v/@tuist/locale.svg?style=flat
[locale-npm]: https://npmjs.org/package/@tuist/locale
[preferences-url]: https://github.com/tuist-org/tuist/tree/next/packages/@tuist/preferences
[preferences-image]: https://img.shields.io/npm/v/@tuist/preferences.svg?style=flat
[preferences-npm]: https://npmjs.org/package/@tuist/preferences
[sample-url]: https://github.com/tuist-org/sample-project
[shortcuts-url]: https://github.com/tuist-org/tuist/tree/next/packages/@tuist/shortcuts
[shortcuts-image]: https://img.shields.io/npm/v/@tuist/shortcuts.svg?style=flat
[shortcuts-npm]: https://npmjs.org/package/@tuist/shortcuts
[story-url]: https://github.com/tuist-org/tuist/tree/next/packages/@tuist/story
[story-image]: https://img.shields.io/npm/v/@tuist/story.svg?style=flat
[story-npm]: https://npmjs.org/package/@tuist/story
[styled-url]: https://github.com/tuist-org/tuist/tree/next/packages/@tuist/styled
[styled-image]: https://img.shields.io/npm/v/@tuist/styled.svg?style=flat
[styled-npm]: https://npmjs.org/package/@tuist/styled
[theme-url]: https://github.com/tuist-org/tuist/tree/next/packages/@tuist/theme
[theme-image]: https://img.shields.io/npm/v/@tuist/theme.svg?style=flat
[theme-npm]: https://npmjs.org/package/@tuist/theme
[tuist-url]: https://github.com/tuist-org/tuist/tree/next/packages/tuist
[tuist-image]: https://img.shields.io/npm/v/tuist.svg?style=flat
[tuist-npm]: https://npmjs.org/package/tuist
[tree-url]: https://github.com/tuist-org/tuist/tree/next/packages/@tuist/tree
[tree-image]: https://img.shields.io/npm/v/@tuist/tree.svg?style=flat
[tree-npm]: https://npmjs.org/package/@tuist/tree
[tree-view-url]: https://github.com/tuist-org/tuist/tree-view/next/packages/@tuist/tree-view
[tree-view-image]: https://img.shields.io/npm/v/@tuist/tree-view.svg?style=flat
[tree-view-npm]: https://npmjs.org/package/@tuist/tree-view
[useragent-url]: https://github.com/tuist-org/tuist/tree/next/packages/@tuist/useragent
[useragent-image]: https://img.shields.io/npm/v/@tuist/useragent.svg?style=flat
[useragent-npm]: https://npmjs.org/package/@tuist/useragent

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

### Dependencies

Here is the order in which we review and update modules (later modules
depend on all or some of the previous ones). Modules with a \* have 100%
coverage.

1. build\*
2. hooks\*
3. locale\*
4. theme\*
5. story [TODO] 100% coverage
6. styled [TODO] fix stories and tests
7. dragdrop [TODO] improve coverage
8. useragent [TODO] write more tests
9. shortcuts [TODO] write more tests
10. editor [TODO] fix stories, fix tests

### Related to tuist live coding

1. code-editor [TODO] add stories and tests
2. tree [TODO] 100% coverage
3. render-tree [TODO] 100% coverage
4. tuist [TODO] fix tests
5. tree-view [TODO] fix stories
6. vscode-tuist [TODO] migrate code
