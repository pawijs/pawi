const DefinePlugin = require('webpack').DefinePlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const { join } = require('path')

const COMMIT_COUNT = require('child_process')
  .execSync('git rev-list HEAD --count')
  .toString()
  .trim()
const APP_VERSION = `v${parseInt(COMMIT_COUNT)}`
console.log(`\n*****************************`)
console.log(`******** BUILD: ${APP_VERSION} *******`)
console.log(`*****************************\n\n`)
function root(path) {
  return join(__dirname, path)
}

const env = process.env.NODE_ENV || 'development'

module.exports = {
  entry: {
    app: root('src/treeEditor/view/boot.tsx'),
  },

  devtool: 'source-map',

  optimization: {
    usedExports: true,
  },

  output: {
    publicPath: '/',
    clean: true,
    path: root('view'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    // This setting is required for web workers to not use 'window'
    globalObject: 'this',
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      ['fake-indexeddb/auto']: false,
    },
  },

  watchOptions: {
    aggregateTimeout: 600,
  },

  devServer: {
    contentBase: root('dist'),
    stats: 'errors-warnings',
  },

  plugins: [
    new DefinePlugin({
      APP_VERSION,
      // Yes this is not advised by WebPack but some older
      // libraries need this for now.
      // FIXME: Update libs and remove.
      process: { env: { NODE_ENV: JSON.stringify(env) } },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      filename: 'index.html',
      template: root('src/treeEditor/view/index.html'),
    }),
  ],

  module: {
    rules: [
      {
        // Look behind assertion
        test: /(?<!\.css)\.tsx?$/,
        include: root('src'),
        use: [
          {
            loader: 'ts-loader',
            options: {
              onlyCompileBundledFiles: true,
            },
          },
        ],
      },
      {
        test: /\.(gif|jpg|png|mp3|aac|ogg|woff|woff2|ttf)$/,
        loader: 'file-loader',
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
    ],
  },
}
