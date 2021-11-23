const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { join } = require('path')
const base = require('./base')

const webpack = {
  mode: 'development', // 环境模式 development production
  plugins: [
    new HtmlWebpackPlugin({
      favicon: join(__dirname, '../public/favicon.ico'),
      template: join(__dirname, '../public/index.html'),
      filename: 'index.html', // 打包后输出的文件名
      inject: false
    })
  ],
  devServer: {
    port: 6871,
    hot: true, // 启用热重载
    compress: true // 压缩
  }
}

module.exports = merge(base, webpack)
