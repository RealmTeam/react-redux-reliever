const path = require('path')

const reduxRelieverSrc = path.join(__dirname, '..', '..', 'src')

module.exports = {
  mode: 'development',
  entry: './examples/counter/src/main.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/static/',
    filename: 'bundle.js'
  },
  resolve: {alias: {'react-redux-reliever': reduxRelieverSrc}},
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [reduxRelieverSrc, __dirname],
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  }
}
