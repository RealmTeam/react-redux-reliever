const path = require('path')

module.exports = ['source-map'].map(devtool => ({
  mode: 'development',
  entry: './src/index.js',
  output: {
    library: 'ReactReduxReliever',
    libraryTarget: 'umd'
  },
  devtool,
  optimization: {
    runtimeChunk: true
  }
}))
