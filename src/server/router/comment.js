const Comment = require('../database/mongoose/model/Comment')
const { GetAdmin, VerifyToken } = require('../utils/adminUtils')
const {
  WordNumberLimit,
  WordNumberExceed,
  GetCommentCounts,
  limitPageNo,
  GetReplyComment,
  limitFilter,
  CommitCommentHandler,
  SendMailHandler
} = require('../utils/commentUtils')
const {
  DeepColne,
  VerifyParams,
  akismet,
  marked,
  timeAgo,
  SendMail
} = require('../utils')

async function GetComment(params) {
  const { pageNo: currentPage, pageSize, path } = params
  // 查询条件
  let options = {
    pid: '',
    path,
    status: 'accept',
    stick: { $ne: 'true' }
  }

  // 查询置顶评论
  let commentsTop = []
  if (currentPage == 1) {
    const optionsTop = DeepColne(options)
    optionsTop.stick = 'true'
    commentsTop = await Comment.find(optionsTop).lean()
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

  // 合并置顶评论和普通评论
  const newComments = [...commentsTop, ...comments]

  // 置顶评论和普通评论一起查询回复评论
  const commentsReply = await GetReplyComment(newComments)

  // 合并评论所有
  const commentsAll = [...commentsTop, ...comments, ...commentsReply]

  const commentConfig = await GetAdmin({}, [
    'word_number',
    'avatar_cdn',
    'marked',
    'highlight'
  ])

  const wordNumber = WordNumberLimit(commentConfig.word_number)
  const avatarCdn = commentConfig.avatar_cdn
  const isMarked = commentConfig.marked == 'true' ? true : false
  const isHighlight = commentConfig.highlight == 'true' ? true : false

  for (const item of commentsAll) {
    item.stick = item.stick == 'true' ? true : false

    item.content = marked(item.content, isMarked, isHighlight)

    // 处理头像
    if (!/^http/.test(item.avatar)) {
      item.avatar = avatarCdn + item.avatar
    }

    item.time = timeAgo(item.created)

    // 删除多余信息
    delete item.ip
    delete item.mail
    delete item.path
    delete item.ua
    delete item.status
    delete item.created
    delete item.updated
  }

  const result = {
    comments: commentsAll,
    counts,
    pageCount,
    wordNumber,
    marked: isMarked,
    highlight: isHighlight
  }

  return result
}

async function CommitComment(params) {
  // 验证评论信息是否合法
  VerifyParams(params, ['nick', 'mail', 'content', 'ua', 'path'])

  const config = await GetAdmin({}, [])


  const token = await VerifyToken(params.token)


  if(!token){
    // 字数限制
    const paramsWordNumber = {
      content: params.content.length,
      nick: params.nick.lenth,
      mail: params.mail.length,
      site: params.site.length
    }
    const isExceed = WordNumberExceed(config.word_number,paramsWordNumber)
    if (isExceed) return '字数超出规定范围'
  }

  // 判断是否使用博主身份评论
  const isAdmin = !token && config.mail === params.mail
  if (isAdmin) return '请先登录，再使用博主身份评论'

  // ip 限流
  await limitFilter(params.ip)

  const akismetData = {
    ip: params.ip,
    name: params.nick,
    email: params.mail,
    content: params.content,
    url: params.site,
    type: params.rid ? 'reply' : 'comment',
    useragent: params.ua
  }

  if (token) params.status = 'accept'
  else
    params.status = await akismet(config.akismet, config.site_url, akismetData)

  const data = await CommitCommentHandler(params, token)

  // 保存评论
  const result = await new Comment(data).save()

  // 保存成功
  if (result) {

    // 没有配置邮件信息则直接结束
    const condition = config.mail_from && config.mail_accept
    if (!condition) return true

    const commentConfig = await GetAdmin({}, [
      'avatar_cdn',
      'marked',
      'highlight'
    ])
    const avatarCdn = commentConfig.avatar_cdn
    const isMarked = commentConfig.marked == 'true' ? true : false
    const isHighlight = commentConfig.highlight == 'true' ? true : false

    data.stick = data.stick == 'true' ? true : false

    data.content = marked(data.content, isMarked, isHighlight)

    // 处理头像
    if (!/^http/.test(data.avatar)) data.avatar = avatarCdn + data.avatar

    // 邮件通知数据处理
    const sends = await SendMailHandler(data, config, token)

    // 发送邮件
    sends.forEach((item) => SendMail(item))
    return true
  }

  return false
}

module.exports = { GetComment, CommitComment }
