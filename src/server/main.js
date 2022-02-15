const { join } = require('path')
const Admin = require('./database/mongoose/model/Admin')
const { Resource, Router } = require('./router/router')

// 设置环境变量
const envPath = join(process.cwd(), '.env')
require('dotenv').config(envPath)

// 连接数据库
require('./database/mongoose')()

module.exports = async (req, res) => {
  // 将配置信息锁定到全局
  global.config = await Admin.findOne().lean()

  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // 处理资源请求
  const isResurce = await Resource(req, res)
  if (isResurce) return res.end(isResurce)

  // 处理业务请求
  await Router(req, res)
}
