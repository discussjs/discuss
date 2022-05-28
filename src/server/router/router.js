const { join } = require('path')
const bodyData = require('body-data')
const SendMail = require('../utils/Mail')

const { init, Login, AdminGetComments, GetConfig, SaveConfig, Import, OperateComment } = require('./admin')
const { GetComment, CommitComment, RecentComment, CommentCount } = require('./comment')
const GetCounter = require('./counter')
const { GetUserIP, CORS, HtmlMinify } = require('../utils')

const NotFound = { msg: 'Not Found' }

/* eslint-disable max-statements , no-console */
async function Router(req, res) {
  let body = {}
  let result = { msg: 'success' }

  try {
    // 将配置信息放置到全局
    if (!global.Dconfig) {
      const { Admin } = global.DiscussDB
      global.Dconfig = (await Admin.select({}))[0]
    }

    // 获取请求参数
    body = await bodyData(req)
    // 获取 UA
    body.ua = req.headers['user-agent']
    // 获取 IP
    body.ip = GetUserIP(req)
    console.log('body', body)

    // 返回初始化页面
    if (!global.Dconfig && body.type !== 'INIT') {
      const path = join(__dirname, '../../../public/init.html')
      const html = HtmlMinify(path)
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.end(html)
      return
    }

    //  eslint-disable-next-line no-inner-declarations
    function Page(file) {
      const path = join(__dirname, `../../../public/${file}.html`)
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      return HtmlMinify(path)
    }

    // 响应初始化页面
    if (!global.Dconfig && body.type !== 'INIT') return res.end(Page('init'))

    // 响应后台管理
    if (req.method.toUpperCase() === 'GET') return res.end(Page('admin'))

    // 邮件通知
    if (body.type === 'PUSH_MAIL') {
      result.data = await SendMail(body)
      res.end(JSON.stringify(result))
      return
    }

    // 跨域
    const isCors = await CORS(req)
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
      case 'IMPORT':
        result.data = await Import(body)
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

module.exports = Router
