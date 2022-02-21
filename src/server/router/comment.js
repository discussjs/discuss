const Comment = require('../database/mongoose/model/Comment')
const { VerifyToken } = require('../utils/adminUtils')
const {
  WordNumberLimit,
  WordNumberExceed,
  SendMailHandler,
  GetCommentCounts,
  limitPageNo,
  GetReplyComment,
  limitFilter,
  CommentHandler,
  VerufyMailANDSite,
  CommitCommentHandler
} = require('../utils/commentUtils')
const { IndexHandler, DeepColne, VerifyParams, akismet } = require('../utils')

/* eslint-disable max-statements  */
// 获取评论
async function GetComment(params) {
  const config = global.config
  const commentCount = config.commentCount
  // 处理index.html
  params.path = IndexHandler(params.path)

  const { pageNo, path } = params
  // 查询条件
  let options = {
    pid: '',
    path,
    status: 'accept',
    stick: { $ne: true }
  }

  /*
  查询置顶评论
  只有在第一页的时候才会查询置顶评论(只查询一次置顶评论)
  一次性查出所有置顶评论
  */
  let commentsTop = []
  if (pageNo === 1) {
    const optionsTop = DeepColne(options)
    optionsTop.stick = true
    commentsTop = await Comment.find(optionsTop).sort({ created: -1 }).lean()
  }

  // 获取通过审核的评论数
  const optionsCount = DeepColne(options)
  delete optionsCount.stick
  const counts = await GetCommentCounts(optionsCount)

  // 限制页码
  const { page, pageCount } = await limitPageNo(pageNo, commentCount, options)

  const comments = await Comment.find(options)
    .skip((page - 1) * commentCount)
    .limit(commentCount)
    .sort({ created: -1 })
    .lean()

  // 合并置顶评论和普通评论
  const newComments = [...commentsTop, ...comments]

  // 置顶评论和普通评论一起查询回复评论
  const commentsAll = await GetReplyComment(newComments)

  const wordNumber = WordNumberLimit(config.wordNumber)

  const result = {
    comments: CommentHandler(commentsAll),
    counts,
    pageCount,
    wordNumber
  }

  return result
}

// 提交评论
async function CommitComment(params) {
  // 验证评论信息是否合法
  VerifyParams(params, ['nick', 'mail', 'content', 'ua', 'path'])
  // 验证邮箱和网址是否正确
  VerufyMailANDSite(params.mail, params.site)

  // 查询rid是否存在
  const RplayComment = await Comment.findById(params.rid)

  const config = global.config

  // 验证token是否正确
  const token = await VerifyToken(params.token)

  if (token) params.status = 'accept'
  else {
    // 判断是否使用博主身份评论
    if (config.mail === params.mail) throw new Error('login')
    // ip 限流
    await limitFilter(params.ip)
    // 字数限制
    const isExceed = WordNumberExceed(config.wordNumber, params)
    if (isExceed) throw new Error('Word count exceeds the specified range !')

    const akismetData = {
      ip: params.ip,
      name: params.nick,
      email: params.mail,
      content: params.content,
      url: params.site,
      type: params.rid ? 'reply' : 'comment',
      useragent: params.ua
    }
    params.status = await akismet(config.akismet, config.siteUrl, akismetData)
  }

  const data = await CommitCommentHandler(params)

  // 如果是回复评论则写入回复评论的昵称
  if (RplayComment) data.rnick = RplayComment.nick

  // 保存评论
  const result = await new Comment(data).save()

  await SendMailHandler(config, data)

  delete data.token
  delete data.type

  if (result) return CommentHandler([data])
  return false
}
/* eslint-enable max-statements */

// 获取最新评论
async function RecentComment(params) {
  const config = global.config
  let query = { status: 'accept' }
  if (params.reply === false) query.pid = ''

  const comment = await Comment.find(query)
    .sort({ created: -1 })
    .limit(config.commentCount || 10)
    .lean()

  for (let item of comment) {
    item = CommentHandler(item)
  }

  return comment
}

// 获取评论数
async function CommentCount(params) {
  VerifyParams(params, ['paths'])
  if (!Array.isArray(params.paths)) return

  // 处理index.html
  const paths = params.paths.map((item) => IndexHandler(item))

  // 处理查询项
  const options = { path: { $in: paths } }
  if (params.reply === false) options.pid = ''

  const query = [
    { $match: options },
    { $group: { _id: '$path', count: { $sum: 1 } } }
  ]
  const resultArr = await Comment.aggregate(query)

  // 格式化
  const result = []
  for (const item in paths) {
    result.push({
      path: paths[item],
      count: resultArr[item] ? resultArr[item].count : 0
    })
  }

  return result
}

module.exports = { GetComment, CommitComment, RecentComment, CommentCount }
