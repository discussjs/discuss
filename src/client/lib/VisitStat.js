import request from './request'

/**
 * 访问量统计
 * @param {String} url 请求地址
 * @param {String} path 请求路径
 */
async function VisitStat(url, path) {
  const counterEle = document.getElementById('Discuss-Visitors')
  if (!counterEle) return
  if (!path) path = location.pathname

  const options = {
    url,
    data: {
      type: 'COUNTER',
      path
    }
  }

  const { data } = await request(options)

  if (data) counterEle.innerText = data
}

export default VisitStat
