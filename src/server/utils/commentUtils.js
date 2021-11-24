const Comment = require('../database/mongoose/model/Comment')
const { GetAdmin } = require('./adminUtils')
const { XSS, GetAvatar, DeepColne,IndexHandler } = require('./index')

/**
 * 限制字数
 * @param {String} configWordNumber
 * @returns {Object}
 */
function WordNumberLimit(configWordNumber) {
  let [
    contentWordNumber,
    nickWordNumber,
    mailWordNumber,
    siteWordNumber
  ] = configWordNumber.split(',').map((item)=> parseInt(item))

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
function WordNumberExceed(configWordNumber,paramsWordNumber) {

  const {
    contentWordNumber,
    nickWordNumber,
    mailWordNumber,
    siteWordNumber
  } = WordNumberLimit(configWordNumber)
  const {content,nick,mail,site} = paramsWordNumber

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
async function limitPageNo(pageNo, pageSize, options) {
  // 根据父评论数量进行分页
  const counts = await Comment.find(options).countDocuments().lean()

  let pageCount = Math.ceil(counts / pageSize)
  if (pageCount < 1) pageCount = 1
  // 当前页大于总页数则将返回最后一页
  if (pageNo > pageCount) {
    pageNo = pageCount
  }

  return { pageNo, pageCount }
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

  const { limit, limitAll } = await GetAdmin()

  // 10分钟内，相同的ip能评论多少条(默认10)
  if (parseInt(limit)) {
    const count = await Comment.find().countDocuments({
      ip,
      created: { $gt: Date.now() - tenmin }
    })
    if (count > limit) {
      throw new Error('发言频率过高')
    }
  }
  // 10分钟内，所有的ip能评论多少条
  if (parseInt(limitAll)) {
    const count = await Comment.find().countDocuments({
      created: { $gt: Date.now() - tenmin }
    })
    if (count > limitAll) {
      throw new Error('服务器繁忙，请稍后再试...')
    }
  }
}

function SendMailTemplateHandler(option) {
  const html = option.template
    .replace(/\${subject}/g, option.subject)
    .replace(/\${avatar}/g, option.avatar)
    .replace(/\${nick}/g, option.nick)
    .replace(/\${content}/g, option.content)
    .replace(/\${url}/g, option.url)

  return html
}

// 发送邮件处理
async function SendMailHandler(params, config, token) {
  const sends = []

  // 初始化模板渲染
  const option = {
    avatar: params.avatar,
    nick: params.nick,
    content: params.content,
    url: config.site_url + params.path,
    template: config.mail_template,
    subject: config.master_subject
  }

  // 初始化博主邮件信息
  const mailOprions = {
    host: config.mail_host,
    port: config.mail_port,
    user: config.mail_from,
    pass: config.mail_accept,
    from: config.mail_from,
    to: config.mail,
    subject: config.master_subject,
    html: SendMailTemplateHandler(option)
  }

  // 存储博主收到的邮件信息 (如果是博主则不保存)
  if (!token) sends.push(DeepColne(mailOprions))

  // 处理回复评论通知
  const _id = []
  const rid = params.rid
  const pid = params.pid
  if (rid) _id.push({ _id: rid })
  if (pid) _id.push({ _id: pid })
  if (pid) {
    // 设置邮件标题 | 渲染邮件标题
    mailOprions.subject = config.reply_subject
    option.subject = config.reply_subject

    // 根据评论id查询父邮箱(返回一个数组)
    const mailArr = await Comment.find({ $or: _id }, ['mail'])
    for (const item of mailArr) {
      // 如果回复的邮箱是博主邮箱这终止当前循环进入下一次循环
      if (item.mail == config.mail) continue
      // 处理保存邮件通知信息
      mailOprions.to = item.mail
      mailOprions.html = SendMailTemplateHandler(option)
      sends.push(DeepColne(mailOprions))
    }
  }
  return sends
}

module.exports = {
  WordNumberLimit,
  WordNumberExceed,
  UpdateComment,
  DeleteComment,
  GetReplyComment,
  GetCommentCounts,
  limitPageNo,
  CommitCommentHandler,
  limitFilter,
  SendMailHandler
}
