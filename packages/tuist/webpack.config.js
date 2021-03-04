const resolve = require('path').resolve

module.exports = {
  mode: 'development',
  entry: "./src/index.ts",
  module: {
    rules: [
      { 
        test: /\.tsx?$/,
        use: "ts-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "tuist.js",
    path: resolve(__dirname, 'dist'),
  },
};