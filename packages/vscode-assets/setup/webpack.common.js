const join = require('path').join
const CopyWebpackPlugin = require('copy-webpack-plugin')
const EnvironmentPlugin = require('webpack').EnvironmentPlugin
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const lucidogenGit = new GitRevisionPlugin()
const WorkboxPlugin = require('workbox-webpack-plugin')
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
  CopyWebpackPlugin,
  EnvironmentPlugin,
  GitRevisionPlugin,
  HtmlWebpackPlugin,
  common: {
    output: {
      publicPath: '',
      path: root('dist'),
      filename: '[name].js',
      chunkFilename: '[name].js',
      // This setting is required for web workers to not use 'window'
      globalObject: 'this',
    },

    optimization: {
      minimize: false,
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 6,
        maxInitialRequests: Infinity,
        automaticNameDelimiter: '~',
        automaticNameMaxLength: 30,
        cacheGroups: {
          lucidogen: {
            test: /lucidogen\/packages\/node_modules/,
            name(module) {
              const packageName = module.context.match(
                /lucidogen\/packages\/node_modules\/@lucidogen\/([^\/]+)/
              )[1]

              return `lu.${packageName.replace('@', '')}`
            },
          },
          modules: {
            test: /lucidogen\/node_modules/,
            name(module) {
              const packageName = module.context.match(
                /lucidogen\/node_modules\/([^\/]+)/
              )[1]

              return `npm.${packageName.replace('@', '')}`
            },
          },
        },
      },
    },

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
    },

    resolveLoader: {
      modules: ['node_modules', root('setup/loaders')],
    },
  }, // END OF COMMON

  plugins: [
    new ProgressBarPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: root('assets') },
        {
          from: require.resolve('pdfjs-dist/build/pdf.worker.js'),
        },
      ],
    }),
    new EnvironmentPlugin({
      APP_ENV: process.env.APP_ENV || env,
      BROWSER: true,
      NODE_ENV: env,
      RELEASE_DATE: new Date().toISOString(),
      LUCIDOGEN_COMMIT: lucidogenGit.commithash().slice(0, 7),
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: root('setup/bundle-report.html'),
      openAnalyzer: false,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true,
      maximumFileSizeToCacheInBytes: 12 * 1024 * 1024, // 12 MB (pdf worker is huge, typescript is huge)
    }),
  ],
}
