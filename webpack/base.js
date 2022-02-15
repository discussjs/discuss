const webpack = require('webpack')
const { join } = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const cleanCssLoader = {
  loader: 'clean-css-loader',
  options: {
    skipWarn: false,
    compatibility: 'ie9',
    level: 2,
    inline: ['remote']
  }
}

const postCssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [['postcss-preset-env']]
    }
  }
}

module.exports = {
  entry: join(__dirname, '../src/client/main.js'),
  output: {
    path: join(__dirname, '../dist'),
    filename: './Discuss.js',
    chunkFilename: '[name].Discuss.js',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
        options: {
          removeSVGTagAttrs: false
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, // 不编译node_modules下的文件
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env']],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      {
        test: /\.(css|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          cleanCssLoader,
          postCssLoader,
          'sass-loader'
        ]
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
