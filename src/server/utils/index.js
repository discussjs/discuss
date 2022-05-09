const GetIP = require('get-user-ip')
const { readFileSync, existsSync } = require('fs')
const { join, parse } = require('path')
const CORS = require('./CORS')
const simpleUnique = require('simple-unique')
const VerifyParams = require('./verify')
const akismet = require('./akismet')
const XSS = require('./XSS')
const { GetAvatar, SetAvatar } = require('./avatar')
const HtmlMinify = require('./minify')
const { jwtSign, jwtVerify } = require('./jwt')

const Unique = (size) => simpleUnique(size || 24)

// 获取用户IP
function GetUserIP(req) {
  // 如果try没有报错返回try的return结果，反正返回方法底部的return结果
  try {
    // 获取自定义请求头IP，以逗号分隔为数组
    let requestHeaders = ''
    if (global && global.Dconfig) {
      requestHeaders = global.Dconfig.requestHeaders || ''
    }

    const array = requestHeaders.split(',') || []

    return GetIP(req, array)
  } catch (error) {
    // eslint-disable-next-line
    console.log('GetUserIP:', error)
  }
  return GetIP(req)
}

function IndexHandler(params) {
  let path = params.replace(/(\/index\.html|\/)*$/gi, '')
  if (path.length === 0) path += '/'
  return path
}

// 获取 favicon
function GetFavicon() {
  let path = join(process.cwd(), 'favicon.ico')
  if (!existsSync(path)) path = join(__dirname, '../../../public/favicon.ico')
  if (!existsSync(path)) return false
  return readFileSync(path, 'binary')
}

// 设置 favicon
function SetFavicon(res) {
  const content = GetFavicon()
  if (!content) return
  res.setHeader('Content-Type', 'image/x-icon')
  res.write(content, 'binary')
  return content
}

function Discussjs(url) {
  const path = join(__dirname, '../../../dist', parse(url).base)
  if (!existsSync(path)) return
  return readFileSync(path, { encoding: 'utf-8' })
}

function DeepColne(options = {}) {
  const str = JSON.stringify(options)
  const json = JSON.parse(str)
  return json
}

module.exports = {
  GetUserIP,
  Unique,
  IndexHandler,
  GetFavicon,
  SetFavicon,
  Discussjs,
  DeepColne,
  CORS,
  VerifyParams,
  akismet,
  jwtSign,
  jwtVerify,
  XSS,
  GetAvatar,
  SetAvatar,
  HtmlMinify
}
