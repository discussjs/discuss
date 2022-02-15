const bcrypt = require('bcrypt')
const { existsSync } = require('fs')
const { join } = require('path')
const { jwtSign, DeepColne } = require('../utils')
const Admin = require('../database/mongoose/model/Admin')
const Comment = require('../database/mongoose/model/Comment')

const { SECRET, VerifyToken, isInit } = require('../utils/adminUtils')
const {
  GetCommentCounts,
  limitPageNo,
  DeleteComment,
  UpdateComment
} = require('../utils/commentUtils')
const { HtmlMinify, VerifyParams } = require('../utils')

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
    if (!isToken) throw new Error('Token expired')
    result.token = token
    return result
  }

  // 验证评论信息是否合法
  VerifyParams(params, ['username', 'password'])

  const isUsername = username === config.username
  const isPassword = bcrypt.compareSync(password, config.password)
  // 用户名密码是否正确
  if (!isUsername || !isPassword) throw new Error('User name or password error')

  result.token = jwtSign({ id: config._id }, SECRET, { expiresIn: '7d' })
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
 * 模糊多条件查询
 * @param {*} options
 * @param {*} keyword
 * @param {*} searchType
 * @returns
 */
function FuzzyQueries(options, keyword, searchType) {
  if (!keyword) return
  const reg = new RegExp(keyword, 'i')
  if (searchType !== 'all') {
    options[searchType] = reg
  } else {
    options.$or = [
      //多条件，数组
      { nick: { $regex: reg } },
      { mail: { $regex: reg } },
      { site: { $regex: reg } },
      { ip: { $regex: reg } },
      { content: { $regex: reg } },
      { path: { $regex: reg } }
    ]
  }
}

/* eslint-disable max-statements */
/**
 * 管理员获取评论
 * @param {Object} params
 * @returns
 */
async function AdminGetComments(params) {
  const config = global.config

  const token = await VerifyToken(params.token)
  if (!token) throw new Error('Token exception')

  let { pageSize } = params
  if (!pageSize) pageSize = config.commentCount
  const { pageNo, keyword, searchType, status, path } = params

  const options = { status }

  if (status === 'current') {
    options.path = path
    delete options.status
  }

  // 查询博主评论
  if (status === 'master') {
    delete options.status
    options.mail = config.mail
  }

  // 模糊查询
  FuzzyQueries(options, keyword, searchType)

  const counts = await GetCommentCounts(options, false)

  // 限制页码
  const { page, pageCount } = await limitPageNo(pageNo, pageSize, options)

  const comments = await Comment.find(options)
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .sort({ created: -1 })
    .lean()

  const avatarCdn = config.avatarCdn
  for (const item of comments) {
    // 处理头像
    if (!/^http/.test(item.avatar)) {
      item.avatar = avatarCdn + item.avatar
    }

    item.time = item.created

    // 删除多余信息
    delete item.status
    delete item.created
    delete item.updated
  }

  const result = { comments, counts, pageCount, pageSize }

  return result
}

/* eslint-enable max-statements  */

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
  const isToken = await VerifyToken(token)
  if (!isToken) throw new Error('Token exception')

  // 判断操作是否为删除，如果不是则为修改
  if (exec === 'delete') return await DeleteComment(id)

  return await UpdateComment(id, exec, comment)
}

// 获取配置信息
async function GetConfig({ token }) {
  const isToken = await VerifyToken(token)
  if (!isToken) throw new Error('Token exception')

  const config = DeepColne(global.config)
  delete config._id
  delete config.password
  return config
}

// 保存配置信息
async function SaveConfig(params) {
  const { data, token } = params

  const isToken = await VerifyToken(token)
  if (!isToken) throw new Error('Token exception')

  // 修改密码处理
  if (data.password) data.password = bcrypt.hashSync(data.password, 10)

  // 转换为数字类型
  data.limit = parseInt(data.limit)
  data.limitAll = parseInt(data.limitAll)
  data.commentCount = parseInt(data.commentCount)
  data.siteUrl = data.siteUrl?.replace(/\/$/, '')

  const { _id } = global.config
  await Admin.updateOne({ _id }, data)
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
