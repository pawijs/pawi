# snowpack-pawi

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]

[npm-image]: https://img.shields.io/npm/v/snowpack-pawi.svg?style=flat
[npm-url]: https://npmjs.org/package/snowpack-pawi
[travis-image]: https://img.shields.io/travis/pawijs/pawi.svg?style=flat
[travis-url]: https://travis-ci.com/pawijs/pawi

Snowpack plugin for [Pawi](http://pawijs.org) live-coding.

With this plugin, the render tree does not need to be rebuilt through a full
page reload but can reload only the required blocks.

```sh
npm install --save-dev snowpack-pawi
```

```js
// snowpack.config.js
module.exports = {
  plugins: ['snowpack-pawi'],
}
```

NB: The dependency to 'pawi' is to ensure semver major bump in case the HMR api changes in
pawi-link.
