const webpack = require('webpack')
const { join } = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// 最新的 vue-loader 中，VueLoaderPlugin 插件的位置有所改变
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  entry: join(__dirname, '../src/client/main.js'),
  output: {
    path: join(__dirname, '../dist'),
    filename: './Discuss.js',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, // 不编译node_modules下的文件
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    })
  ]
}
