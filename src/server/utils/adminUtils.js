const Admin = require('../database/mongoose/model/Admin')
const { jwtVerify } = require('./jwt')

const SECRET = process.env.DISCUSS_SECRET || 'Discuss'

/**
 * 是否已初始化
 * @returns {Boolean}
 */
async function isInit() {
  const isinit = await Admin.find().estimatedDocumentCount()
  if (isinit) return true
  return false
}

/**
 * 验证token是否正确
 * @param {String} token token信息
 * @returns
 */
async function VerifyToken(token) {
  const { msg, id } = jwtVerify(token, SECRET)
  if (msg) return false
  if (id) {
    const condition = id === global.config._id.toString()
    if (condition) return true
    return false
  }
}

module.exports = { SECRET, isInit, VerifyToken }
