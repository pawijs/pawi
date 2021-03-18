// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  buildOptions: {
    out: '../../../view',
  },
  plugins: ['@snowpack/plugin-typescript'],
  optimize: {
    bundle: true,
    minify: true,
    target: 'es2020',
  },
}
