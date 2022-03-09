const { jwtVerify } = require('./jwt')

const SECRET = process.env.DISCUSS_SECRET || 'Discuss'

/**
 * 验证token是否正确
 * @param {String} token token信息
 * @returns
 */
async function VerifyToken(token) {
  const data = jwtVerify(token, SECRET)
  if (data.msg) return false
  if (data.id) {
    const condition = data.id === global.Dconfig.id.toString()
    if (condition) return true
    return false
  }
}

module.exports = { SECRET, VerifyToken }
