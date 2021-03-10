const { merge } = require('webpack-merge')
const common = require('./webpack.view.js')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
})
