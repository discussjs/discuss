const Router = require('./router/router')
const { init } = require('./router/admin')
const { SetFavicon, Discussjs } = require('./utils')
// 连接数据库
require('./database/mongoose')()

module.exports = async (req, res) => {
  // 将配置信息锁定到全局
  if (!global.Dconfig) await init()

  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  // 设置favicon
  if (req.url === '/favicon.ico') {
    const favicon = SetFavicon(res)
    return res.end(favicon)
  }

  // 返回JS
  if (/\.js$/.test(req.url)) {
    const js = Discussjs(req.url)
    if (js) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
    }
    return res.end(js || '{ msg: "Not Found" }')
  }

  // 处理业务请求
  await Router(req, res)
}
