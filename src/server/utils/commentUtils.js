const bcrypt = require('bcryptjs')
const axios = require('axios')
const { JSDOM } = require('jsdom')
const { Unique, XSS, SetAvatar, DeepClone, IndexHandler, VerifyParams, GetAvatar } = require('./index')

/**
 * 限制字数
 * @param {String} configWordNumber
 * @returns {Object}
 */
function WordNumberLimit(configWordNumber) {
  let [content, nick, mail, site] = configWordNumber.split(',').map((item) => parseInt(item))

  nick = nick || 0
  mail = mail || 0
  site = site || 0
  content = content || 0

  return {
    nick,
    mail,
    site,
    content
  }
}

/* eslint-disable no-console */
function WordExceedsOutput(text, content, wordNumber) {
  console.log(text + ' word count:', content)
  console.log(text + ' specified word count:', wordNumber)
  console.log(text + ' exceeds word count:', content - wordNumber)
}
/* eslint-enable no-console */

/**
 * 字数是否超出范围
 * @param {String} configWordNumber
 * @param {Object} paramsWordNumber
 * @returns {Boolean}
 */
/* eslint-disable max-statements */
function WordNumberExceed(configWordNumber, params) {
  // 自定义限制字数
  const { nick: nickWord, mail: mailWord, site: siteWord, content: contentWord } = WordNumberLimit(configWordNumber)

  // 实际输入字数
  const nick = params.nick.length
  const mail = params.mail.length
  const site = params.site.length
  const dom = new JSDOM(params.content)
  const content = dom.window.document.body.textContent.length + dom.window.document.querySelectorAll('img').length

  const nickExceed = nickWord && nick > nickWord
  const mailExceed = mailWord && mail > mailWord
  const siteExceed = siteWord && site > siteWord
  const contentExceed = contentWord && content > contentWord

  if (contentExceed) WordExceedsOutput('Content', content, contentWord)
  if (nickExceed) WordExceedsOutput('Nickname', nick, nickWord)
  if (mailExceed) WordExceedsOutput('Mail', mail, mailWord)
  if (siteExceed) WordExceedsOutput('Site', site, siteWord)

  const condition = contentExceed || nickExceed || mailExceed || siteExceed

  return condition
}
/* eslint-enable max-statements */

async function SendMailHandler(config, data) {
  // 发送邮件通知请求
  try {
    // 验证邮件配置是否完整
    VerifyParams(config, ['mailHost', 'mailPort', 'mailFrom', 'mailAccept', 'masterSubject', 'replySubject'])

    data.type = 'PUSH_MAIL'

    // 加密生成token
    const encrypted = config.username + config.password + config.mail
    data.token = bcrypt.hashSync(encrypted, 10)

    const serverURLs = config.serverURLs
    if (serverURLs) {
      await Promise.race([
        axios({
          url: serverURLs,
          data,
          method: 'post',
          headers: { origin: config.siteUrl }
        }),
        new Promise((resolve) => setTimeout(resolve, 1000)) // 延迟1s后继续向下执行，不再等待
      ])
    }
  } catch (error) {
    /* eslint-disable no-console */
    console.error('Mail ERROR: Mail configuration information error cancel sending emails')
    // console.error(error)
    /* eslint-enable no-console */
  }
}

/**
 * 修改状态
 * @param {*} arr
 * @param {*} status
 * @param {*} comment
 * @returns
 */
async function UpdateComment(arr, exec, comment) {
  const { updateComment } = global.DiscussDB
  let data = { status: exec }

  // 修改为置顶
  if (exec === 'stick') data = { stick: true }
  if (exec === 'unstick') data = { stick: false }
  // 判断是否为编辑的评论
  if (comment) data = comment

  for (const i of arr) await updateComment(i, data)
}

// 删除评论
async function DeleteComment(arr) {
  const { deleteComment } = global.DiscussDB
  for (const id of arr) await deleteComment(id)
}

// token 正确则不查询回复评论了
async function GetReplyComment(comments) {
  const { getComment } = global.DiscussDB
  for (const item of comments) {
    const id = item.id
    const replys = await getComment({ pid: id, status: 'accept' })
    // 处理回复评论
    item.replys = CommentHandler(replys)
  }
  return comments
}

/**
 * 查询数量
 * @param {Object} options json选项
 * @param {Boolean} isClone 是否克隆 default: true
 * @returns {Number}
 */
async function GetCommentCounts(options, isClone = true) {
  const { getCommentCount } = global.DiscussDB
  const newOptions = isClone ? DeepClone(options) : options
  delete newOptions.pid

  // 查询path的所有评论(包含：父评论、子评论、置顶评论)
  const counts = await getCommentCount(newOptions)

  return counts
}

// 限制页码
async function limitPageNo(page, pageSize, options) {
  const { getCommentCount } = global.DiscussDB
  // 根据父评论数量进行分页
  const counts = await getCommentCount(options)

  let pageCount = Math.ceil(counts / pageSize)
  if (pageCount < 1) pageCount = 1
  // 当前页大于总页数则将返回最后一页
  if (page > pageCount) {
    page = pageCount
  }

  return { page, pageCount }
}

// 删除多余信息
function DeleteRedundant(comment) {
  delete comment.ip
  delete comment.mail
  delete comment.path
  delete comment.ua
  delete comment.status
  delete comment.created
  delete comment.updated
}

function CommentHandler(comments) {
  const config = global.Dconfig
  const obj = {}
  for (let comment of comments) {
    if (comment.mail === config.mail) comment.master = true

    // 处理头像
    comment.avatar = GetAvatar(comment.avatar)

    if (comment.replys) {
      obj[comment.id] = comment
      for (const reply of comment.replys) {
        obj[reply.id] = reply
        reply.rnick = obj[reply.rid] && obj[reply.rid].nick ? obj[reply.rid].nick : 'Anonymity'
      }
    }
    comment.time = comment.created
    DeleteRedundant(comment)
  }
  return comments
}

// 评论信息处理函数
/* eslint-disable max-statements  */
async function CommitCommentHandler(params) {
  const data = {}
  const timestamp = Date.now()
  const content = XSS(params.content)
  const created = timestamp
  const updated = timestamp
  let path = IndexHandler(params.path)

  const avatar = await SetAvatar(params.mail)

  const _idDB = ['mysql', 'postgresql', 'sqlite']
  if (_idDB.includes(process.env.DISCUSS_DB_TYPE)) data.id = Unique()

  data.nick = params.nick
  data.mail = params.mail
  data.site = params.site
  data.content = content
  data.pid = params.pid || ''
  data.rid = params.rid || ''
  data.ua = params.ua
  data.ip = params.ip
  data.stick = params.stick || false
  data.status = params.status
  data.path = path
  data.avatar = avatar
  data.created = created
  data.updated = updated
  return data
}
/* eslint-enable max-statements  */

/**
 * 验证邮箱和网站地址是否合法
 * @param {*} mail 邮箱
 * @param {*} site 网站
 */
function VerufyMailANDSite(mail, site) {
  function isUrl(str) {
    try {
      if (/^https?:\/\//.test(str) && /([A-Za-z\d]{1,30}\.)+[A-Za-z\d]{2,5}$/.test(new URL(str).hostname)) {
        return true
      }
      // eslint-disable-next-line no-empty
    } catch (error) {}
    return false
  }
  const mailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*(\.[a-z]{2,5})+$/

  const errorMail = 'Mail format does not meet the requirements!'
  const errorSite = 'Site address format does not meet the requirements!'
  if (!mailReg.test(mail)) throw new Error(errorMail)

  if (site.length === 0) return
  if (!isUrl(site)) throw new Error(errorSite)
}

// 限流
async function limitFilter(ip) {
  const { getCommentCountLimit } = global.DiscussDB
  const tenmin = 600000 // 10分钟

  const { limit, limitAll } = global.Dconfig

  // 10分钟内，相同的ip能评论多少条(默认10)
  if (parseInt(limit)) {
    const count = await getCommentCountLimit({ ip, created: tenmin })
    if (count > limit) {
      throw new Error('Commenting too frequently')
    }
  }
  // 10分钟内，所有的ip能评论多少条
  if (parseInt(limitAll)) {
    const count = await getCommentCountLimit({ created: tenmin })
    if (count > limitAll) {
      throw new Error('Server is busy, please try again later...')
    }
  }
}

module.exports = {
  WordNumberLimit,
  WordNumberExceed,
  SendMailHandler,
  UpdateComment,
  DeleteComment,
  GetReplyComment,
  GetCommentCounts,
  limitPageNo,
  CommentHandler,
  CommitCommentHandler,
  VerufyMailANDSite,
  limitFilter
}
