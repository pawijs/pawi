const { common, root, plugins, HtmlWebpackPlugin } = require('./stories')

module.exports = Object.assign({}, common, {
  watch: true,

  entry: {
    app: root('src/stories/index.ts'),
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: ['app'],
      template: root('src/stories/index.html'),
    }),
    ...plugins,
  ],
})
