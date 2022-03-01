const { jwtVerify } = require('./jwt')

const SECRET = process.env.DISCUSS_SECRET || 'Discuss'

/**
 * 验证token是否正确
 * @param {String} token token信息
 * @returns
 */
async function VerifyToken(token) {
  const { msg, id } = jwtVerify(token, SECRET)
  if (msg) return false
  if (id) {
    const condition = id === global.Dconfig._id.toString()
    if (condition) return true
    return false
  }
}

module.exports = { SECRET, VerifyToken }
