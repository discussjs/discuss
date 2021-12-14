const Comment = require('../database/mongoose/model/Comment')
const {
  XSS,
  GetAvatar,
  DeepColne,
  IndexHandler,
  marked,
  timeAgo
} = require('./index')

/**
 * 限制字数
 * @param {String} configWordNumber
 * @returns {Object}
 */
function WordNumberLimit(configWordNumber) {
  let [contentWordNumber, nickWordNumber, mailWordNumber, siteWordNumber] =
    configWordNumber.split(',').map((item) => parseInt(item))

  contentWordNumber = contentWordNumber || 0
  nickWordNumber = nickWordNumber || 0
  mailWordNumber = mailWordNumber || 0
  siteWordNumber = siteWordNumber || 0

  return {
    contentWordNumber,
    nickWordNumber,
    mailWordNumber,
    siteWordNumber
  }
}

/**
 * 字数是否超出范围
 * @param {String} configWordNumber
 * @param {Object} paramsWordNumber
 * @returns {Boolean}
 */
function WordNumberExceed(configWordNumber, paramsWordNumber) {
  const { contentWordNumber, nickWordNumber, mailWordNumber, siteWordNumber } =
    WordNumberLimit(configWordNumber)
  const { content, nick, mail, site } = paramsWordNumber

  const contentExceed = contentWordNumber && content > contentWordNumber
  const nickExceed = nickWordNumber && nick > nickWordNumber
  const mailExceed = mailWordNumber && mail > mailWordNumber
  const siteExceed = siteWordNumber && site > siteWordNumber

  // #region 内容超出输出日志
  if (contentExceed) {
    console.log('内容字数:', content)
    console.log('内容规定字数:', contentWordNumber)
    console.log('内容超出字数:', content - contentWordNumber)
  }
  if (nickExceed) {
    console.log('昵称字数:', content)
    console.log('昵称规定字数:', nickExceed)
    console.log('昵称超出字数:', content - nickExceed)
  }
  if (mailExceed) {
    console.log('邮箱字数:', content)
    console.log('邮箱规定字数:', mailExceed)
    console.log('邮箱超出字数:', content - mailExceed)
  }
  if (siteExceed) {
    console.log('网址字数:', content)
    console.log('网址规定字数:', siteExceed)
    console.log('网址超出字数:', content - siteExceed)
  }
  // #endregion

  const condition = contentExceed || nickExceed || mailExceed || siteExceed

  return condition
}

/**
 * 修改状态
 * @param {*} arr
 * @param {*} status
 * @param {*} comment
 * @returns
 */
async function UpdateComment(arr, exec, comment) {
  let data = { status: exec }

  // 修改为置顶
  if (exec == 'stick') data = { stick: true }
  if (exec == 'unstick') data = { stick: false }
  // 判断是否为编辑的评论
  if (comment) data = comment

  return await Comment.updateMany({ _id: { $in: arr } }, data)
}

// 删除评论
async function DeleteComment(arr) {
  return await Comment.deleteMany({ _id: { $in: arr } })
}

// token 正确则不查询回复评论了
async function GetReplyComment(comments) {
  const commentsReply = []
  for (const item of comments) {
    const id = item._id.toString() // toString 将 new ObjectId() 转换为 id
    const replys = await Comment.find({ pid: id }).lean()
    commentsReply.push(...replys)
  }
  return commentsReply
}

async function GetCommentCounts(options) {
  const newOptions = DeepColne(options)
  delete newOptions.pid
  delete newOptions.stick

  // 查询改path的所有评论(包含：父评论、子评论、置顶评论)
  const counts = await Comment.find(newOptions).countDocuments().lean()
  return counts
}

// 限制页码
async function limitPageNo(page, pageSize, options) {
  // 根据父评论数量进行分页
  const counts = await Comment.find(options).countDocuments().lean()

  let pageCount = Math.ceil(counts / pageSize)
  if (pageCount < 1) pageCount = 1
  // 当前页大于总页数则将返回最后一页
  if (page > pageCount) {
    page = pageCount
  }

  return { page, pageCount }
}

function CommentHandler(data) {
  const config = global.config
  const avatarCdn = config.avatar_cdn
  const marked_enable = config.marked.enable + '' == 'true' ? true : false
  const highlight_enable = config.highlight.enable + '' == 'true' ? true : false

  data.content = marked(data.content, marked_enable, highlight_enable)

  // 处理头像
  if (!/^http/.test(data.avatar)) {
    data.avatar = avatarCdn + data.avatar
  }

  data.time = timeAgo(data.created)

  // 删除多余信息
  delete data.ip
  delete data.mail
  delete data.path
  delete data.ua
  delete data.status
  delete data.created
  delete data.updated

  return data
}

async function CommitCommentHandler(params, token) {
  const data = {}
  const timestamp = Date.now()
  const content = XSS(params.content)
  const created = timestamp
  const updated = timestamp
  let path = IndexHandler(params.path)

  const avatar = await GetAvatar(params.mail)

  // 验证是否是博主评论
  if (token) data.master = true

  data.nick = params.nick
  data.mail = params.mail
  data.site = params.site
  data.content = content
  data.pid = params.pid || ''
  data.rid = params.rid || ''
  data.ua = params.ua
  data.ip = params.ip
  data.status = params.status
  data.path = path
  data.avatar = avatar
  data.created = created
  data.updated = updated
  return data
}

// 限流
async function limitFilter(ip) {
  const tenmin = 600000 // 10分钟

  const { limit, limitAll } = global.config

  // 10分钟内，相同的ip能评论多少条(默认10)
  if (parseInt(limit)) {
    const count = await Comment.find().countDocuments({
      ip,
      created: { $gt: Date.now() - tenmin }
    })
    if (count >= limit) {
      throw new Error('发言频率过高')
    }
  }
  // 10分钟内，所有的ip能评论多少条
  if (parseInt(limitAll)) {
    const count = await Comment.find().countDocuments({
      created: { $gt: Date.now() - tenmin }
    })
    if (count >= limitAll) {
      throw new Error('服务器繁忙，请稍后再试...')
    }
  }
}

module.exports = {
  WordNumberLimit,
  WordNumberExceed,
  UpdateComment,
  DeleteComment,
  GetReplyComment,
  GetCommentCounts,
  limitPageNo,
  CommentHandler,
  CommitCommentHandler,
  limitFilter
}
