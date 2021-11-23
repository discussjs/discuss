const { merge } = require('webpack-merge')
const base = require('./base')

const webpack = {
  mode: 'production', // 环境模式
}

module.exports = merge(base, webpack)
