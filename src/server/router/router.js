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
      const { getAdmin } = global.DiscussDB
      global.Dconfig = await getAdmin()
    }

    // 获取请求参数
    body = await bodyData(req)
    // 获取 UA
    body.ua = req.headers['user-agent']
    // 获取 IP
    body.ip = GetUserIP(req)
    console.log('body', body)

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

    const contrller = {
      INIT: init,
      GET_COMMENT: GetComment,
      COMMIT_COMMENT: CommitComment,
      GET_COMMENT_ADMIN: AdminGetComments,
      OPERATE_COMMENT: OperateComment,
      LOGIN: Login,
      GET_CONFIG: GetConfig,
      SAVE_CONFIG: SaveConfig,
      IMPORT: Import,
      COUNTER: GetCounter,
      RECENT_COMMENT: RecentComment,
      COMMENT_COUNT: CommentCount
    }

    const fn = contrller[body.type]
    if (fn) {
      result.data = await fn(body)
    } else {
      result = NotFound
    }
  } catch (error) {
    console.error('Request param', body)
    console.error('ERROR:', error)
    result.msg = error == null ? void 0 : error.toString()
  }
  res.end(JSON.stringify(result))
}

module.exports = Router
