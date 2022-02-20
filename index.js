// 设置环境变量
const envPath = require('path').join(process.cwd(), '.env')
require('dotenv').config(envPath)

const server = require('./src/server')
const main = require('./src/server/main')

module.exports = { server, main }
