import request from '../lib/request'

/**
 * 请求评论数量(一般用于首页显示某篇文章有多少条评论)
 * @param {String} url 请求地址
 * @param {Array} paths 请求的标识符(网站path)
 * @param {Boolean} reply 是否请求回复评论 默认: true
 * @returns {Array}
 */
async function CommentCount(url, paths, reply) {
  if (!url || !paths) throw new Error('"url" or "paths" cannot be empty')
  const options = {
    url,
    method: 'post',
    data: {
      type: 'COMMENT_COUNT',
      paths,
      reply
    }
  }

  const { data } = await request(options)
  return data
}

export default CommentCount
