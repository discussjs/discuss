const bodyData = require('body-data')
const SendMail = require('../utils/Mail')

const {
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
const { GetUserIP, CORS } = require('../utils')

const NotFound = { msg: 'Not Found' }

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
    const isCors = await CORS(req)
    if (isCors) {
      res.statusCode = 403
      result.msg = 'Request rejected'
      res.end(JSON.stringify(result))
      return
    }

    switch (body.type) {
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

module.exports = Router
