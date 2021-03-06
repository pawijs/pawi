# @pawi/theme

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
![100% coverage][coverage-image]

[npm-image]: https://img.shields.io/npm/v/@pawi/theme.svg?style=flat
[npm-url]: https://npmjs.org/package/@pawi/theme
[travis-image]: https://img.shields.io/travis/pawijs/pawi.svg?style=flat
[travis-url]: https://travis-ci.org/pawijs/pawi
[coverage-image]: https://user-images.githubusercontent.com/79422935/109943846-79cd3980-7d3a-11eb-959b-2b8d33da3c28.png

A block to use themes in Overmind apps. The theming values are stored inside
the `theme` state in Overmind and styling uses CSS variables instead of a
react context.

Each block can add/alter values in any given theme. The used theme
overwrites values in the `default` theme. This means that apart from
the `default`, other themes can be partial.
