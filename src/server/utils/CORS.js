// 拦截所有请求

async function CORSHandler(req, res) {
  // 设置安全域名
  const { domain } = global.config || {}

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  if (!domain) return false

  // 获取请求域名(去除协议)
  let origin = req.headers.origin
  if (origin) origin = origin.replace(/^https?:\/\//, '').replace(/\/$/, '')

  const isDomain = domain.indexOf(origin) !== -1

  return !isDomain
}

module.exports = CORSHandler
