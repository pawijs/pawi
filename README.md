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

## Overmind packages

These packages are used to build Overmind apps (on which the vscode editor is based).

- [![NPM version][build-image]][build-npm] [@pawi/build][build-url]
  (modularity for building modular apps)
- [![NPM version][code-editor-image]][code-editor-npm] [@pawi/code-editor][code-editor-url]
  (code editor based on CodeMirror with scrubbing)
- [![NPM version][dragdrop-image]][dragdrop-npm] [@pawi/dragdrop][dragdrop-url]
  (drag and drop support)
- [![NPM version][editor-image]][editor-npm] [@pawi/editor][editor-url]
  (WYSIWYG editor: not used in vscode extension yet)
- [![NPM version][hooks-image]][hooks-npm] [@pawi/hooks][hooks-url]
  (hooks to trigger actions)
- [![NPM version][locale-image]][locale-npm] [@pawi/locale][locale-url]
  (internationalization)
- [![NPM version][preferences-image]][preferences-npm] [@pawi/preferences][preferences-url]
  (user UI state persistance)
- [![NPM version][shortcuts-image]][shortcuts-npm] [@pawi/shortcuts][shortcuts-url]
  (keyboard shortcuts)
- [![NPM version][story-image]][story-npm] [@pawi/story][story-url]
  (storybook to help develop components)
- [![NPM version][styled-image]][styled-npm] [@pawi/styled][styled-url]
  (basic components)
- [![NPM version][theme-image]][theme-npm] [@pawi/theme][theme-url]
  (theming support)
- [![NPM version][tree-image]][tree-npm] [@pawi/tree][tree-url]
  (root-tree definition and methods)
- [![NPM version][tree-view-image]][tree-view-npm] [@pawi/tree-view][tree-view-url]
  (visual composer for root-tree structures)
- [![NPM version][useragent-image]][useragent-npm] [@pawi/useragent][useragent-url]
  (detect useragent, online, offline and other helpers)

[build-url]: https://github.com/pawijs/pawi/tree/next/packages/@pawi/build
[build-image]: https://img.shields.io/npm/v/@pawi/build.svg?style=flat
[build-npm]: https://npmjs.org/package/@pawi/build
[code-editor-url]: https://github.com/pawijs/pawi/tree/next/packages/@pawi/code-editor
[code-editor-image]: https://img.shields.io/npm/v/@pawi/code-editor.svg?style=flat
[code-editor-npm]: https://npmjs.org/package/@pawi/code-editor
[dragdrop-url]: https://github.com/pawijs/pawi/tree/next/packages/@pawi/dragdrop
[dragdrop-image]: https://img.shields.io/npm/v/@pawi/dragdrop.svg?style=flat
[dragdrop-npm]: https://npmjs.org/package/@pawi/dragdrop
[editor-url]: https://github.com/pawijs/pawi/tree/next/packages/@pawi/editor
[editor-image]: https://img.shields.io/npm/v/@pawi/editor.svg?style=flat
[editor-npm]: https://npmjs.org/package/@pawi/editor
[hooks-url]: https://github.com/pawijs/pawi/tree/next/packages/@pawi/hooks
[hooks-image]: https://img.shields.io/npm/v/@pawi/hooks.svg?style=flat
[hooks-npm]: https://npmjs.org/package/@pawi/hooks
[locale-url]: https://github.com/pawijs/pawi/tree/next/packages/@pawi/locale
[locale-image]: https://img.shields.io/npm/v/@pawi/locale.svg?style=flat
[locale-npm]: https://npmjs.org/package/@pawi/locale
[preferences-url]: https://github.com/pawijs/pawi/tree/next/packages/@pawi/preferences
[preferences-image]: https://img.shields.io/npm/v/@pawi/preferences.svg?style=flat
[preferences-npm]: https://npmjs.org/package/@pawi/preferences
[sample-url]: https://github.com/pawijs/sample-project
[shortcuts-url]: https://github.com/pawijs/pawi/tree/next/packages/@pawi/shortcuts
[shortcuts-image]: https://img.shields.io/npm/v/@pawi/shortcuts.svg?style=flat
[shortcuts-npm]: https://npmjs.org/package/@pawi/shortcuts
[story-url]: https://github.com/pawijs/pawi/tree/next/packages/@pawi/story
[story-image]: https://img.shields.io/npm/v/@pawi/story.svg?style=flat
[story-npm]: https://npmjs.org/package/@pawi/story
[styled-url]: https://github.com/pawijs/pawi/tree/next/packages/@pawi/styled
[styled-image]: https://img.shields.io/npm/v/@pawi/styled.svg?style=flat
[styled-npm]: https://npmjs.org/package/@pawi/styled
[theme-url]: https://github.com/pawijs/pawi/tree/next/packages/@pawi/theme
[theme-image]: https://img.shields.io/npm/v/@pawi/theme.svg?style=flat
[theme-npm]: https://npmjs.org/package/@pawi/theme
[pawi-url]: https://github.com/pawijs/pawi/tree/next/packages/pawi
[pawi-image]: https://img.shields.io/npm/v/pawi.svg?style=flat
[pawi-npm]: https://npmjs.org/package/pawi
[tree-url]: https://github.com/pawijs/pawi/tree/next/packages/@pawi/tree
[tree-image]: https://img.shields.io/npm/v/@pawi/tree.svg?style=flat
[tree-npm]: https://npmjs.org/package/@pawi/tree
[tree-view-url]: https://github.com/pawijs/pawi/tree-view/next/packages/@pawi/tree-view
[tree-view-image]: https://img.shields.io/npm/v/@pawi/tree-view.svg?style=flat
[tree-view-npm]: https://npmjs.org/package/@pawi/tree-view
[useragent-url]: https://github.com/pawijs/pawi/tree/next/packages/@pawi/useragent
[useragent-image]: https://img.shields.io/npm/v/@pawi/useragent.svg?style=flat
[useragent-npm]: https://npmjs.org/package/@pawi/useragent

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

### Related to pawi live coding

1. tree [TODO] 100% coverage
2. tree-view [TODO] 100% coverage (through stories)
3. pawi [TODO] fix tests
