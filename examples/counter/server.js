const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const config = require('./webpack.config')

const compiler = webpack(config)

const server1 = new WebpackDevServer(compiler, {
  contentBase: __dirname,
  publicPath: '/static/',
  port: 3000,
  hot: true
})

server1.listen(3000, 'localhost', function() {})
