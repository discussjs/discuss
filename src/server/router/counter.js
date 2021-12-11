const Counter = require('../database/mongoose/model/Counter')
const { VerifyParams } = require('../utils')

// 递增
async function Increasing(path) {
  const result = await Counter.updateOne(
    { path },
    {
      $inc: { time: 1 },
      $set: { updatedDate: Date.now() }
    }
  )
  if (result.matchedCount) return true

  return false
}

module.exports = async (params) => {
  VerifyParams(params, ['path'])
  const path = params.path

  // 递归+1
  const isInc = await Increasing(path)

  // 新增
  if (!isInc) await new Counter({ path }).save()

  const record = await Counter.findOne({ path })

  return record.time || 1
}
