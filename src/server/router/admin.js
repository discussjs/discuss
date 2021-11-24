const bcrypt = require('bcrypt')
const { join } = require('path')
const { jwt_sign, jwt_verify } = require('../utils')
const Admin = require('../database/mongoose/model/Admin')
const Comment = require('../database/mongoose/model/Comment')

const { SECRET, VerifyToken, GetAdmin, isInit } = require('../utils/adminUtils')
const {
  GetCommentCounts,
  limitPageNo,
  DeleteComment,
  UpdateComment
} = require('../utils/commentUtils')
const { marked, timeAgo, HtmlMinify } = require('../utils')

/**
 * 初始化
 * @param {String} username 用户名
 * @param {String} password 密码
 * @param {String} mail 邮箱
 * @returns
 */
async function init({ username, password, mail }) {
  password = bcrypt.hashSync(password, 10)
  const isinit = await isInit()
  if (isinit) return isinit

  const init = await new Admin({ username, password, mail }).save()
  if (init) return true
  return false
}

/**
 * 登录 并且返回token
 * @param {String} username 用户名
 * @param {String} password 密码
 * @param {String} token token
 * @returns
 */
async function login({ username, password, token }) {
  const result = { token: false }
  if (token) {
    result.token = await VerifyToken(token)
    return result
  }

  const DB = await Admin.find({ username })
  const resultDB = DB[0]
  const isPassword = bcrypt.compareSync(password, resultDB.password)
  if (isPassword) {
    result.token = jwt_sign({ id: resultDB._id }, SECRET, { expiresIn: '7d' })
    return result
  }
  return result
}

/**
 *  打开初始化页面(返回html页面)
 * @param {Request} req Request
 * @param {Response} res Response
 * @returns
 */
async function InitPage(req, res) {
  const isinit = await isInit()
  if (isinit) return isinit

  const path = join(__dirname, '../../../public/init.html')

  if (!existsSync(path)) return true
  const result = HtmlMinify(path)
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.end(result)
  return false
}

/**
 * 管理员获取评论
 * @param {Object} params
 * @returns
 */
async function AdminGetComments(params) {
  const token = await VerifyToken(params.token)
  if (!token) return false

  const {
    pageNo: currentPage,
    pageSize,
    keyword,
    status,
    current,
    path
  } = params

  const options = { keyword, status }

  if (current) {
    options.path = path
    delete options.status
  }

  // 查询博主评论
  if (status === 'master') {
    delete options.status
    options.master = 'true'
  }

  const counts = await GetCommentCounts(options)

  // 限制页码
  const { pageNo, pageCount } = await limitPageNo(
    currentPage,
    pageSize,
    options
  )

  const comments = await Comment.find(options)
    .skip((pageNo - 1) * pageSize)
    .limit(pageSize)
    .sort({ created: -1 })
    .lean()

  const commentConfig = await GetAdmin({}, [
    'avatar_cdn',
    'marked',
    'highlight'
  ])
  const avatarCdn = commentConfig.avatar_cdn
  const isMarked = commentConfig.marked == 'true' ? true : false
  const isHighlight = commentConfig.highlight == 'true' ? true : false

  for (const item of comments) {
    item.stick = item.stick == 'true' ? true : false

    item.OriginalContent = item.content

    item.content = marked(item.content, isMarked, isHighlight)

    // 处理头像
    if (!/^http/.test(item.avatar)) {
      item.avatar = avatarCdn + item.avatar
    }

    item.time = timeAgo(item.created)

    // 删除多余信息
    delete item.status
    delete item.created
    delete item.updated
  }

  const result = { comments, counts, pageCount }

  return result
}

/**
 * 操作评论
 * @param {Array} id
 * @param {String} exec
 * @param {String} token
 * @param {Array} comment
 * @returns
 */
async function OperateComment({ id, exec, token, comment }) {
  // 判断是否为管理员身份
  const isAdmin = await VerifyToken(token)
  if (!isAdmin) return false

  // 判断操作是否为删除，如果不是则为修改
  if (exec == 'delete') return await DeleteComment(id)

  return await UpdateComment(id, exec, comment)
}

// 获取配置信息
async function GetConfig(params) {
  const token = await VerifyToken(params.token)
  if (!token) return false
  const config = await GetAdmin({}, [])
  delete config._id
  delete config.password
  return config
}

// 保存配置信息
async function SaveConfig(params) {
  const { data, token } = params

  // 转换为数字类型
  data.limit = parseInt(data.limit)
  data.limitAll = parseInt(data.limitAll)
  data.site_url = data.site_url.replace(/\/$/, '')

  const { id } = jwt_verify(token, SECRET)
  if (id) {
    await Admin.updateOne({ _id: id }, data)
    return true
  }
  return false
}

module.exports = {
  InitPage,
  init,
  login,
  AdminGetComments,
  GetConfig,
  SaveConfig,
  OperateComment
}
