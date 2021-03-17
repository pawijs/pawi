// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  buildOptions: {
    out: '../../../view',
  },
  packageOptions: {
    external: ['fake-indexeddb/auto'],
  },
  plugins: ['@snowpack/plugin-typescript'],
  optimize: {
    bundle: true,
    minify: true,
    target: 'es2020',
  },
}
