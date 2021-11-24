const dotenv = require('dotenv')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { join } = require('path')
const base = require('./base')

// 配置环境变量
const envPath = join(process.cwd(), '.env')
dotenv.config(envPath)
const port = parseInt(process.env.DISCUSS_PORT)

const webpack = {
  mode: 'development', // 环境模式 development production
  plugins: [
    new HtmlWebpackPlugin({
      port: port,
      favicon: join(__dirname, '../public/favicon.ico'),
      template: join(__dirname, '../public/index.html'),
      filename: 'index.html', // 打包后输出的文件名
      inject: false
    })
  ],
  devServer: {
    port: port + 1,
    hot: true, // 启用热重载
    compress: true // 压缩
  }
}

module.exports = merge(base, webpack)
