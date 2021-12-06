const http = require('http')
const { join } = require('path')
const dotenv = require('dotenv')

// 设置环境变量
const envPath = join(process.cwd(), '.env')
dotenv.config(envPath)

const main = require('./main')

let PORT = process.env.PORT || process.env.DISCUSS_PORT || 6870

async function init() {
  const server = http.createServer(main)
  server.listen(PORT, () => {
    console.log('Service is up and running port: ' + PORT)
  })
}

module.exports = init
