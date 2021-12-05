const { readFileSync, existsSync } = require('fs')
const { join } = require('path')
const timeAgo = require('./timeAgo')
const cors = require('./CORS')
const VerifyParams = require('./verify')
const akismet = require('./akismet')
const marked = require('./marked')
const XSS = require('./XSS')
const GetAvatar = require('./avatar')
const { HtmlMinify } = require('./minify')
const { jwt_sign, jwt_verify } = require('./jwt')

function IndexHandler(params) {
  let path = params.replace(/\/index\.html|\/$/gi, '')
  if (path.length == 0) path += '/'
  return path
}

// 获取请求数据
async function GetPostData(req) {
  return new Promise((resolve, reject) => {
    req.on('data', (chunk) => {
      resolve(JSON.parse(chunk))
    })
  })
}

//传入请求HttpRequest
function GetClientIP(req) {
  return (
    req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
    req.connection.remoteAddress || // 判断 connection 的远程 IP
    req.socket.remoteAddress || // 判断后端的 socket 的 IP
    req.connection.socket.remoteAddress
  )
}

// 获取 favicon
function GetFavicon() {
  let path = join(process.cwd(), 'favicon.ico')
  if (!existsSync(path)) path = join(__dirname, '../../../public/favicon.ico')
  if (!existsSync(path)) return false
  const content = readFileSync(path, 'binary')
  return content
}

// 设置 favicon
function SetFavicon(req, res) {
  if (req.url === '/favicon.ico') {
    const content = GetFavicon()
    if (!content) return false
    res.setHeader('Content-Type', 'image/x-icon')
    res.write(content, 'binary')
    res.end()
    return true
  }
}

function Discussjs() {
  const path = join(__dirname, '../../../dist/Discuss.js')
  if (!existsSync(path)) return '这里什么都没有哦 OwO !'
  return readFileSync(path, { encoding: 'utf-8' })
}

function DeepColne(options = {}) {
  const str = JSON.stringify(options)
  const json = JSON.parse(str)
  return json
}

module.exports = {
  IndexHandler,
  GetPostData,
  GetClientIP,
  GetFavicon,
  SetFavicon,
  Discussjs,
  DeepColne,
  cors,
  VerifyParams,
  akismet,
  jwt_sign,
  jwt_verify,
  marked,
  XSS,
  GetAvatar,
  timeAgo,
  HtmlMinify
}
