const { SendMail } = require('./utils/Mail')
const { join } = require('path')
const Admin = require('./database/mongoose/model/Admin')

// 设置环境变量
const envPath = join(process.cwd(), '.env')
require('dotenv').config(envPath)

// 连接数据库
require('./database/mongoose')()

const {
  init,
  InitPage,
  Login,
  AdminGetComments,
  GetConfig,
  SaveConfig,
  OperateComment
} = require('./router/admin')
const {
  GetComment,
  CommitComment,
  RecentComment,
  CommentCount
} = require('./router/comment')
const GetCounter = require('./router/counter')
const {
  CORS,
  GetPostData,
  GetClientIP,
  SetFavicon,
  Discussjs,
  HtmlMinify
} = require('./utils')

/*
此方法解决非项目核心功能
*/
async function FrontLoading(req, res) {
  // 返回JS
  if (req.url === '/Discuss.js') return res.end(Discussjs())

  // 设置favicon
  const favicon = SetFavicon(req, res)
  if (favicon) return true

  if (req.method === 'GET') {
    const isInit = await InitPage(req, res)

    if (isInit) {
      const path = require('path').join(__dirname, '../../public/server.html')
      const result = HtmlMinify(path)
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.end(result)
    }
    return true
  }
}

module.exports = async (req, res) => {
  // 将配置信息锁定到全局
  global.config = await Admin.findOne().lean()

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')

  // 处理所有get请求
  const resultFL = await FrontLoading(req, res)
  if (resultFL) return

  let body = {}
  let result = { msg: 'success' }

  try {
    body = await GetPostData(req)
    body.ua = req.headers['user-agent']
    body.ip = GetClientIP(req)
    console.log('body', body)

    if (body.type === 'PUSH_MAIL') {
      result.data = await SendMail(body)
      res.end(JSON.stringify(result))
      return
    }

    const isCors = await CORS(req, res)
    if (isCors) {
      res.statusCode = 403
      result.msg = '请求遭到拒绝'
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
      case 'PUSH_MAIL':
        result.data = await SendMail(body)
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
    }
  } catch (error) {
    console.error('请求参数：', body)
    console.error('错误信息：', error)
    result.msg = 'Discuss: ' + error
  }
  res.end(JSON.stringify(result))
}
