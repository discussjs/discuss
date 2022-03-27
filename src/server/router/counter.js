const { Unique, VerifyParams, IndexHandler } = require('../utils')

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
    const data = { time: ++result.time, updated: Date.now() }
    result = (await Counter.update(data, { path }))[0]
  } else {
    const created = Date.now()
    const updated = Date.now()
    const data = { path, time: 1, created, updated }

    const _idDB = ['mysql', 'postgresql', 'sqlite']
    if (_idDB.includes(process.env.DISCUSS_DB_TYPE)) data.id = Unique()

    result = await Counter.add(data)
  }

  return result.time || 1
}
