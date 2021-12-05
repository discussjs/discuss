const bcrypt = require('bcrypt')
const { existsSync } = require('fs')
const { join } = require('path')
const { jwt_sign, jwt_verify, DeepColne } = require('../utils')
const Admin = require('../database/mongoose/model/Admin')
const Comment = require('../database/mongoose/model/Comment')

const { SECRET, VerifyToken, isInit } = require('../utils/adminUtils')
const {
  GetCommentCounts,
  limitPageNo,
  DeleteComment,
  UpdateComment
} = require('../utils/commentUtils')
const { marked, timeAgo, HtmlMinify, VerifyParams } = require('../utils')

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
async function Login(params) {
  const config = global.config

  const { username, password, token } = params
  const result = {}

  // 判断token是否有效
  if (token) {
    const isToken = await VerifyToken(token)
    if (!isToken) throw new Error('Token已过期')
    result.token = isToken
    return result
  }

  // 验证评论信息是否合法
  VerifyParams(params, ['username', 'password'])

  const isUsername = username === config.username
  const isPassword = bcrypt.compareSync(password, config.password)
  // 用户名密码是否正确
  if (!isUsername || !isPassword) throw new Error('用户名或密码错误')

  if (isPassword) {
    result.token = jwt_sign({ id: config._id }, SECRET, { expiresIn: '7d' })
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
  const config = global.config

  const token = await VerifyToken(params.token)
  if (!token) return false

  let { pageSize } = params
  if (!pageSize) pageSize = config.comment_count
  const { pageNo, keyword, status, current, path } = params

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
  const { page, pageCount } = await limitPageNo(pageNo, pageSize, options)

  const comments = await Comment.find(options)
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .sort({ created: -1 })
    .lean()

  const avatarCdn = config.avatar_cdn

  const markedOptions = {}
  const highlightOptions = {}
  markedOptions.enable = config.marked.enable + '' == 'true' ? true : false
  markedOptions.source = config.marked.source
  highlightOptions.enable =
    config.highlight.enable + '' == 'true' ? true : false
  highlightOptions.source = config.highlight.source
  highlightOptions.theme = config.highlight.theme

  for (const item of comments) {
    item.stick = item.stick == 'true' ? true : false
    item.master = item.master == 'true' ? true : false

    item.OriginalContent = item.content

    item.content = marked(
      item.content,
      markedOptions.enable,
      highlightOptions.enable
    )

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

  const result = { comments, counts, pageCount, pageSize }

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

  const config = DeepColne(global.config)
  delete config._id
  delete config.password
  config.marked_enable = config.marked.enable
  config.marked_source = config.marked.source
  config.highlight_enable = config.highlight.enable
  config.highlight_source = config.highlight.source
  config.highlight_theme = config.highlight.theme

  delete config.marked
  delete config.highlight
  return config
}

// 保存配置信息
async function SaveConfig(params) {
  const { data, token } = params

  // 修改密码处理
  if (data.password) data.password = bcrypt.hashSync(data.password, 10)

  // 转换为数字类型
  data.limit = parseInt(data.limit)
  data.limitAll = parseInt(data.limitAll)
  data.comment_count = parseInt(data.comment_count)
  data.site_url = data.site_url.replace(/\/$/, '')

  data.marked = {}
  data.highlight = {}
  data.marked.enable = data.marked_enable + '' == 'true' ? true : false
  data.marked.source = data.marked_source
  data.highlight.enable = data.highlight_enable + '' == 'true' ? true : false
  data.highlight.source = data.highlight_source
  data.highlight.theme = data.highlight_theme

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
  Login,
  AdminGetComments,
  GetConfig,
  SaveConfig,
  OperateComment
}
