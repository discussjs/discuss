const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const Comment = require('../database/mongoose/model/Comment')
const marked = require('./marked')
const { join } = require('path')
const { HtmlMinify } = require('./minify')

let config = global.config
let transporter = null

function parse(comment) {
  const avatarCdn = config.avatar_cdn
  const isMarked = config.marked == 'true' ? true : false
  const isHighlight = config.highlight == 'true' ? true : false
  comment.content = marked(comment.content, isMarked, isHighlight)

  // 处理头像
  const condition = /^http/.test(comment.avatar)
  if (!condition) comment.avatar = avatarCdn + comment.avatar
  return comment
}

async function SendMail(comment) {
  config = global.config
  // 计算Token
  const encrypted = config.username + config.password + config.mail
  const isToken = bcrypt.compareSync(encrypted, comment.token)
  if (isToken) {

    // 创建初始化Mail
    transporter = InitMail()

    // 验证 SMTP 配置
    await VerifyMail()

    comment = parse(comment)
    await Promise.all([
      noticeMaster(comment), // 博主
      noticeLandlord(comment), // 楼主
      noticeReply(comment) // 被回复者
    ]).catch(console.error)

    return
  }

  console.log('发送邮件失败')
  return
}
// 通知博主
async function noticeMaster(comment) {
  if (config.mail === comment.mail) return

  let options = {
    subject: config.master_subject,
    avatar: comment.avatar,
    nick: comment.nick,
    content: comment.content,
    url: config.site_url + comment.path,
    ip: comment.ip,
    mail: comment.mail
  }
  if (config.master_template) {
    options.template = TemplateHandler(config.master_template)
    options.template = HtmlMinify(options)
  } else {
    const path = join(__dirname, '../../../public/master.html')
    options.template = HtmlMinify(path)
    options.template = TemplateHandler(options)
  }

  await Send({
    from: config.mail_from,
    to: config.mail,
    subject: config.master_subject,
    html: options.template
  })
}

// 通知楼主
async function noticeLandlord(comment) {
  if (config.mail === comment.mail) return
  if (!comment.pid) return

  let pComment = await Comment.findOne({ _id: comment.pid }).lean()
  pComment = parse(pComment)
  if (pComment.mail === comment.mail) return

  let options = {
    subject: config.reply_subject,
    avatar: comment.avatar,
    nick: comment.nick,
    content: comment.content,
    url: config.site_url + comment.path,
    Pavatar: pComment.avatar,
    Pcontent: pComment.content
  }
  if (config.reply_template) {
    options.template = TemplateHandler(config.reply_template)
    options.template = HtmlMinify(options)
  } else {
    const path = join(__dirname, '../../../public/reply.html')
    options.template = HtmlMinify(path)
    options.template = TemplateHandler(options)
  }

  await Send({
    from: config.mail_from,
    to: pComment.mail,
    subject: config.master_subject,
    html: options.template
  })
}

// 通知被回复者
async function noticeReply(comment) {
  if (config.mail === comment.mail) return
  if (!comment.pid) return
  if (!comment.rid) return

  let pComment = await Comment.findOne({ _id: comment.rid }).lean()
  pComment = parse(pComment)
  if (pComment.mail === comment.mail) return

  let options = {
    subject: config.reply_subject,
    avatar: comment.avatar,
    nick: comment.nick,
    content: comment.content,
    url: config.site_url + comment.path,
    Pavatar: pComment.avatar,
    Pcontent: pComment.content
  }
  if (config.reply_template) {
    options.template = TemplateHandler(config.reply_template)
    options.template = HtmlMinify(options)
  } else {
    const path = join(__dirname, '../../../public/reply.html')
    options.template = HtmlMinify(path)
    options.template = TemplateHandler(options)
  }

  await Send({
    from: config.mail_from,
    to: pComment.mail,
    subject: config.master_subject,
    html: options.template
  })
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
    .replace(/\${Pavatar}/g, option.Pavatar)
    .replace(/\${Pcontent}/g, option.Pcontent)
}

function InitMail() {
  return nodemailer.createTransport({
    host: config.mail_host,
    port: config.mail_port,
    secure: true,
    auth: {
      user: config.mail_from,
      pass: config.mail_accept
    }
  })
}

// 验证 SMTP 配置
async function VerifyMail() {
  try {
    const success = await transporter.verify()
    if (success) console.log('SMTP 邮箱配置正常')
    return true
  } catch (error) {
    throw new Error('SMTP 邮箱配置异常：', error)
  }
}

// 发送
async function Send(options) {
  try {
    // 开始发送
    const success = await transporter.sendMail(options)
    if (success) {
      console.log('SMTP 邮箱通知成功')
      console.log('SMTP 邮箱通知细节:', success)
    }
  } catch (error) {
    throw new Error('SMTP 邮箱通知异常：', error)
  }
}
module.exports = {
  SendMail
}
