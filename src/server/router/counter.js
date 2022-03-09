const { VerifyParams, IndexHandler } = require('../utils')

module.exports = async (params) => {
  const { Counter } = global.DiscussDB

  // 验证 path 是否存在
  VerifyParams(params, ['path'])

  // 处理/index.html
  const path = IndexHandler(params.path)

  // 查询
  let result = (await Counter.select({ path }))[0]

  // 判断是否有统计记录
  // 有: 自增1
  // 没有: 新增记录
  if (result) {
    const options = { time: ++result.time, updated: Date.now() }
    await Counter.update(options, { path })
  } else {
    const options = { path, time: 1, created: Date.now(), updated: Date.now() }
    await Counter.add(options)
  }

  return result.time || 1
}
