import request from '../lib/request'

/**
 * 请求评论数量
 * @param {String} url 请求地址
 * @param {Array} paths 请求的标识符(网站path)
 * @param {Boolean} reply 是否请求回复评论 默认: true
 * @returns {Array}
 */
async function CommentCount(url, paths, reply) {
  if (!url || !paths) return
  const options = {
    url,
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
