const bodyData = require('body-data')

const { join } = require('path')
const { existsSync } = require('fs')
const SendMail = require('../utils/Mail')
const { isInit } = require('../utils/adminUtils')
const {
  init,
  Login,
  AdminGetComments,
  GetConfig,
  SaveConfig,
  OperateComment
} = require('./admin')
const {
  GetComment,
  CommitComment,
  RecentComment,
  CommentCount
} = require('./comment')
const GetCounter = require('./counter')
const {
  GetUserIP,
  CORS,
  SetFavicon,
  Discussjs,
  HtmlMinify
} = require('../utils')

const NotFound = { msg: 'Not Found' }

async function Resource(req, res) {
  // 返回JS
  if (/\.js$/.test(req.url)) return Discussjs(req.url)

  // 设置favicon
  if (req.url === '/favicon.ico') return SetFavicon(res)

  // 处理get请求
  if (req.method === 'GET') {
    // 判断是否已经初始化管理员用户，如果结果为false，则响应初始化页面
    const is = await isInit()
    if (!is) {
      const path = join(__dirname, '../../../public/init.html')
      const html = HtmlMinify(path)
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      return html
    }

    // 如果已经初始化管理员用户，则查看根目录是否存在index.html文件
    // 存在: 返回该html页面，不存在: 返回{msg:'Not Found'}
    const path = join(process.cwd(), 'index.html')
    if (!existsSync(path)) return JSON.stringify(NotFound)
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    return HtmlMinify(path)
  }
}

/* eslint-disable max-statements , no-console */
async function Router(req, res) {
  let body = {}
  let result = { msg: 'success' }

  try {
    body = await bodyData(req)
    body.ua = req.headers['user-agent']
    body.ip = GetUserIP(req)
    console.log('body', body)

    // 邮件通知
    if (body.type === 'PUSH_MAIL') {
      result.data = await SendMail(body)
      res.end(JSON.stringify(result))
      return
    }

    // 跨域
    const isCors = await CORS(req, res)
    if (isCors) {
      res.statusCode = 403
      result.msg = 'Request rejected'
      res.end(JSON.stringify(result))
      return
    }

    switch (body.type) {
      case 'INIT':
        result.data = await init(body)
        break
      case 'GET_COMMENT':
        result.data = await GetComment(body)
        break
      case 'COMMIT_COMMENT':
        result.data = await CommitComment(body)
        break
      case 'GET_COMMENT_ADMIN':
        result.data = await AdminGetComments(body)
        break
      case 'OPERATE_COMMENT':
        result.data = await OperateComment(body)
        break
      case 'LOGIN':
        result.data = await Login(body)
        break
      case 'GET_CONFIG':
        result.data = await GetConfig(body)
        break
      case 'SAVE_CONFIG':
        result.data = await SaveConfig(body)
        break
      case 'COUNTER':
        result.data = await GetCounter(body)
        break
      case 'RECENT_COMMENT':
        result.data = await RecentComment(body)
        break
      case 'COMMENT_COUNT':
        result.data = await CommentCount(body)
        break
      default:
        result = NotFound
    }
  } catch (error) {
    console.error('Request param', body)
    console.error('ERROR:', error)
    result.msg = error === null || error === void 0 ? void 0 : error.toString()
  }
  res.end(JSON.stringify(result))
}

module.exports = { Resource, Router }
