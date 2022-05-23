import request from '../lib/request'

/**
 * 访问量统计
 * @param {String} url 请求地址
 * @param {String} path 请求路径
 */
async function VisitStat(url, path) {
  if (!url || !path) throw new Error('"url" or "path" cannot be empty')

  const options = {
    url,
    method: 'post',
    data: {
      type: 'COUNTER',
      path
    }
  }

  const { data } = await request(options)

  return data
}

export default VisitStat
