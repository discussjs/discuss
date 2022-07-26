const { Unique, VerifyParams, IndexHandler } = require('../utils')

async function GetCounter(params) {
  const { addCounter, getCounter, updateCounter } = global.DiscussDB

  // 验证 path 是否存在
  VerifyParams(params, ['path'])

  // 处理/index.html
  const path = IndexHandler(params.path)

  // 查询
  let result = await getCounter(path)

  // 判断是否有统计记录
  // 有: 自增1
  // 没有: 新增记录
  if (result) {
    await updateCounter({ path, updated: Date.now() })
  } else {
    const created = Date.now()
    const updated = Date.now()
    const data = { path, time: 1, created, updated }

    const _idDB = ['mysql', 'postgresql', 'sqlite']
    if (_idDB.includes(process.env.DISCUSS_DB_TYPE)) data.id = Unique()

    await addCounter(data)
  }

  return (result && ++result.time) || 1
}

module.exports = GetCounter
