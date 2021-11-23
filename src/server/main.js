// 连接数据库
const mongoose = require('./database/mongoose')
mongoose(process.env.DISCUSS_MONGODB)

const {
  init,
  InitPage,
  login,
  AdminGetComments,
  GetConfig,
  SaveConfig,
  OperateComment
} = require('./router/admin')
const { GetComment, CommitComment } = require('./router/comment')
const { cors, GetPostData, GetClientIP, SetFavicon } = require('./utils')


module.exports = async (req, res) => {

  const favicon = SetFavicon(req, res) // 设置favicon
  if (favicon) return

  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    const isInit = await InitPage(req, res)

    if (!isInit) res.end('这里什么都没有哦 OwO !')
    return
  }

  let body = {}
  let result = { msg: 'success' }

  try {
    const isCors = await cors(req, res)
    if (!isCors) {
      res.end('请求遭到拒绝')
      return
    }

    body = await GetPostData(req)
    body.ua = req.headers['user-agent']
    body.ip = GetClientIP(req)
    console.log('body', body)

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
        result.data = await login(body)
        break
      case 'GET_CONFIG':
        result.data = await GetConfig(body)
        break
      case 'SAVE_CONFIG':
        result.data = await SaveConfig(body)
        break
    }
  } catch (error) {
    console.error('请求参数：', body)
    console.error('错误信息：', error)
    result.msg = 'Discuss ERROR: ' + error
  }
  res.end(JSON.stringify(result))
}
