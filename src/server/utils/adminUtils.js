const Admin = require('../database/mongoose/model/Admin')
const { jwt_verify } = require('./jwt')

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
 * 查询配置信息
 * @param {Object} filter 查询条件
 * @param {Array} select 查询字段
 * @returns
 */
async function GetAdmin(filter = {}, select = []) {
  const admin = await Admin.find(filter, select).lean()
  return admin[0]
}

/**
 * 验证token是否正确
 * @param {String} token token信息
 * @returns
 */
async function VerifyToken(token) {
  const { msg, id } = jwt_verify(token, SECRET)
  if (msg) return false
  if (id) {
    const DB = await Admin.findById(id)
    if (DB) return true
    return false
  }
}

// 后台查询评论
async function AdminGetComments(params) {
  const { token, status, keyword } = params
  const options = { status: 'accept' }

  // 如果token验证成功则可以定义查询评论状态
  const isAdmin = await VerifyToken({ token })
  if (isAdmin) {
    options.status = status
    const reg = new RegExp(keyword, 'i')
    options['$or'] = [
      //多条件，数组
      { nick: { $regex: reg } },
      { mail: { $regex: reg } },
      { site: { $regex: reg } },
      { ip: { $regex: reg } },
      { content: { $regex: reg } },
      { path: { $regex: reg } }
    ]
  }
  return { options, isAdmin }
}

module.exports = { SECRET, isInit, VerifyToken, AdminGetComments, GetAdmin }
