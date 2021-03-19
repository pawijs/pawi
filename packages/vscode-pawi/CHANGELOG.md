# Change Log

All notable changes to the "vscode-pawi" extension will be documented in this file.

The format is based on [Keep a
Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2021-03-19

### Added

- Library click shows preview of code or branch
- Building with snowpack, bundle is a lot smaller
- Keyboard based preview and open of library elements and blocks (tab,arrow,F2,enter)
- New blocks use the closest block ending in 'default.o.ts'
- TreeEditor library <-> editor sync for file rename/create/delete
- File references in branches are updated on file rename even if no editor is
  opened

## [1.0.1] - 2021-03-16

### Changed

- `[BREAKING]` Tree view now edits `index.o.ts` files
- Branches are now seen as blocks

## [0.0.4] - 2021-03-09

### Added

- Tree view to edit \*.o.json files
- Library view to drag & drop blocks on tree
- Load blocks named \*.o.ts from project
- Load blocks named \*.o.js from project direct dependencies
