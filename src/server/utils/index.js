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

/**
 * 动态获取属性值
 * @param {Object} obj 对象本身
 * @param {String} str 获取对象字符串
 * @returns
 */
function GetProperty(obj, str) {
  str = str.replace(/\[(\w+)\]/g, '.$1') // 处理数组下标
  let arr = str.split('.')
  for (let i in arr) {
    obj = obj[arr[i]] || ''
  }
  return obj
}

//传入请求HttpRequest
function GetClientIP(req) {
  // 获取自定义请求头IP，以逗号分隔为数组
  const request_headers = global.config.request_headers || ''
  const globalIPs = request_headers.split(',') || []
  const defaultIPs = [
    'headers.x-real-ip',
    'headers.x-forwarded-for',
    'connection.remoteAddress',
    'socket.remoteAddress',
    'connection.socket.remoteAddress'
  ]
  // 合并默认请求头和自定义请求头IP
  const ips = [...globalIPs, ...defaultIPs]

  for (const item of ips) {
    // 动态获取请求头信息
    const ip = GetProperty(req, item)
    if (ip) {
      return ip.split(',')[0].trim()
    }
  }
  return null
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
