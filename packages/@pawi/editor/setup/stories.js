const join = require('path').join
const EnvironmentPlugin = require('webpack').EnvironmentPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

function root(path) {
  return join(__dirname, '..', path)
}

function node_modules(path) {
  return join(__dirname, '../../../../node_modules', path)
}

function dist(filename) {
  return root(`/dist/${filename}`)
}

const env = process.env.NODE_ENV || 'development'

module.exports = {
  root,
  dist,
  node_modules,
  EnvironmentPlugin,
  HtmlWebpackPlugin,
  common: {
    output: {
      publicPath: '/',
      path: root('dist'),
    },

    devtool: 'eval-source-map',

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
                configFile: root(`setup/tsconfig.${env}.json`),
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
          test: /\.css.ts$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                filename: '[name].css',
                chunkFilename: '[id].css',
              },
            },
            'css-ts-loader',
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                filename: '[name].css',
                chunkFilename: '[id].css',
              },
            },
            'css-loader',
          ],
        },
      ],
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {},
    },
    devServer: {
      contentBase: root('dist'),
      stats: 'errors-warnings',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },

    resolveLoader: {
      modules: ['node_modules', root('setup/loaders')],
    },
  }, // END OF COMMON

  plugins: [
    new EnvironmentPlugin({
      NODE_ENV: env,
      // required by @pawi/crypt
      BROWSER: true,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
}
