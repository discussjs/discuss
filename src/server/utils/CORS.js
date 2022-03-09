// 拦截所有请求

async function CORSHandler(req) {
  // 设置安全域名
  const { domain } = global.Dconfig || {}

  if (!domain) return false

  // 获取请求域名(去除协议)
  let origin = req.headers.origin
  if (origin) origin = origin.replace(/^https?:\/\//, '').replace(/\/$/, '')

  const isDomain = domain.indexOf(origin) !== -1

  return !isDomain
}

module.exports = CORSHandler
