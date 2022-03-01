// 设置环境变量
require('dotenv').config()
const server = require('./src/server')
const main = require('./src/server/main')

module.exports = { server, main }
