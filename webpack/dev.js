const { merge } = require('webpack-merge')
const base = require('./base')

const webpack = {
  mode: 'development', // 环境模式 development production,
  devtool: 'inline-source-map',
  devServer: {
    port: 6871,
    hot: true, // 启用热重载
    compress: true, // 压缩
    // open: true,
    client: {
      logging: 'warn'
    }
  }
}

module.exports = merge(base, webpack)
