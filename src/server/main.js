const Router = require('./router/router')
const { SetFavicon, Discussjs } = require('./utils')

require('output-line')()
/* eslint-disable */
module.exports = async (req, res) => {
  // 将数据库信息锁定到全局
  if (!global.DiscussDB) {
    const result = require('./database/adapter')()
    // 如果未返回信息，则表示连接错误，直接结束请求
    if (!result) return
    global.DiscussDB = result
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
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
      res.setHeader('Cache-Control', 'public, no-transform, s-maxage=604800, max-age=604800')
    }
    return res.end(js || '{ msg: "Not Found" }')
  }

  // 处理业务请求
  await Router(req, res)
}
