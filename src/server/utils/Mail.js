const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')
const { join } = require('path')
const HtmlMinify = require('./minify')
const { GetAvatar } = require('./avatar')

let config = global.Dconfig
let transporter

function parse(comment) {
  comment.avatar = GetAvatar(comment.avatar)
  return comment
}

// 处理模板
function TemplateHandler(option) {
  return option.template
    .replace(/\${subject}/g, option.subject)
    .replace(/\${avatar}/g, option.avatar)
    .replace(/\${nick}/g, option.nick)
    .replace(/\${content}/g, option.content)
    .replace(/\${url}/g, option.url)
    .replace(/\${ip}/g, option.ip)
    .replace(/\${mail}/g, option.mail)
    .replace(/\${Ravatar}/g, option.Ravatar)
    .replace(/\${Rcontent}/g, option.Rcontent)
}

function InitMail() {
  return nodemailer.createTransport({
    host: config.mailHost,
    port: config.mailPort,
    secure: true,
    auth: {
      user: config.mailFrom,
      pass: config.mailAccept
    }
  })
}

// 验证 SMTP 配置
async function VerifyMail() {
  try {
    const success = await transporter.verify()
    // eslint-disable-next-line no-console
    if (success) console.log('SMTP mailbox configuration is normal')
    return true
  } catch (error) {
    throw new Error('SMTP mailbox configuration exception: ', error)
  }
}

// 发送
async function Send(options) {
  try {
    // 开始发送
    const success = await transporter.sendMail(options)
    if (success) {
      /* eslint-disable no-console*/
      console.log('SMTP email notification success')
      console.log('SMTP mailbox notification details: ', success)
      /* eslint-enable no-console*/
    }
  } catch (error) {
    throw new Error('SMTP mailbox notification exception: ', error)
  }
}

// 查询(父|回复)评论信息
async function PRComment(comment) {
  const { Comment } = global.DiscussDB

  let ids = []
  let pComment = {}
  let rComment = {}

  if (comment.pid) {
    // 如果pid和rid相同，则只查询一条，反正查询两条
    if (comment.pid === comment.rid) ids.push(comment.pid)
    else ids = [comment.rid, comment.pid]

    const comments = await Comment.select({ id: ['IN', ids] })
    for (const item of comments) {
      pComment = item.id === comment.pid ? parse(item) : pComment
      rComment = item.id === comment.rid ? parse(item) : rComment
    }
  }
  return { pComment, rComment }
}

// 博主评论通知处理
async function noticeMaster(comment, { pComment, rComment }) {
  // (博主)评论邮箱与博主邮箱相等，则取消
  if (config.mail === comment.mail) return
  // 楼主评论邮箱与博主邮箱相等，则取消
  if (config.mail === pComment.mail) return
  // 回复评论邮箱与博主邮箱相等，则取消
  if (config.mail === rComment.mail) return

  await noticeHandler(comment, 'master')
}

// 楼主评论通知处理
async function noticeLandlord(comment, { pComment, rComment }) {
  if (!pComment.id || !rComment.id) return
  // (根)自己回复自己，取消通知
  if (comment.mail === pComment.mail) return
  // (子)如果自己是自己的子评论，当被回复时，取消楼主通知(将通知转让给Reply处理)
  if (pComment.mail === rComment.mail) return

  await noticeHandler(comment, 'reply', pComment)
}

// 回复评论通知处理
async function noticeReply(comment, { pComment, rComment }) {
  if (!pComment.id || !rComment.id) return
  // (根)自己回复自己，取消通知
  if (comment.mail === pComment.mail) return
  // (子)自己回复自己，取消通知
  if (comment.mail === rComment.mail) return

  await noticeHandler(comment, 'reply', rComment)
}

/* eslint-disable max-statements */
// 邮箱发送与处理
async function noticeHandler(comment, type, rComment) {
  let options = {
    avatar: comment.avatar,
    nick: comment.nick,
    content: comment.content,
    url: config.siteUrl + comment.path,
    ip: comment.ip,
    mail: comment.mail,
    to: config.mail // 发送目标邮箱(默认为博主邮箱)
  }
  if (type === 'reply') {
    options.to = rComment.mail
    options.Ravatar = rComment.avatar
    options.Rcontent = rComment.content
    delete options.ip
    delete options.mail
  }

  const template = type + 'Template'
  const subject = type + 'Subject'
  const path = join(__dirname, `../../../public/${type}.html`)

  options.subject = config[subject]

  // 判断是否自定义设置了邮件模板
  // 未设置则使用默认模板
  if (config[template]) {
    options.template = HtmlMinify(config[template])
    options.template = TemplateHandler(options)
  } else {
    options.template = HtmlMinify(path)
    options.template = TemplateHandler(options)
  }

  await Send({
    from: config.mailFrom,
    to: options.to,
    subject: options.subject,
    html: options.template
  })
}

module.exports = async (comment) => {
  config = global.Dconfig

  // 计算Token
  const encrypted = config.username + config.password + config.mail
  const isToken = bcrypt.compareSync(encrypted, comment.token)

  if (isToken) {
    // 创建初始化Mail
    transporter = InitMail()

    // 验证 SMTP 配置
    await VerifyMail()
    comment = parse(comment)

    // 获取(父|回复)评论
    const PRC = await PRComment(comment)

    /* eslint-disable no-console*/
    await Promise.all([
      noticeMaster(comment, PRC), // 博主
      noticeLandlord(comment, PRC), // 楼主
      noticeReply(comment, PRC) // 被回复者
    ])
      .then(() => console.log('Send email successfully'))
      .catch((error) => console.error('Error while sending email: ' + error))
    /* eslint-enable no-console*/
  }
}
