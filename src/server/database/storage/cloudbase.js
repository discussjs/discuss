const CloudBase = require('@cloudbase/node-sdk')

const {
  D_TCB_ENV,
  D_TCB_ID,
  D_TCB_KEY,
  SCF_NAMESPACE,
  TENCENTCLOUD_SECRETID,
  TENCENTCLOUD_SECRETKEY,
  DISCUSS_DB_ADMIN = 'd_admin',
  DISCUSS_DB_COMMENT = 'd_comment',
  DISCUSS_DB_COUNTER = 'd_counter'
} = process.env

const app = CloudBase.init({
  env: D_TCB_ENV || SCF_NAMESPACE,
  secretId: D_TCB_ID || TENCENTCLOUD_SECRETID,
  secretKey: D_TCB_KEY || TENCENTCLOUD_SECRETKEY
})

const collections = {}

let db = app.database()

/**
 *
 * @param {String} tableName
 * @returns {CloudBase.Database.CollectionReference}
 */
async function collection(tableName) {
  const instance = db.collection(tableName)
  try {
    if (collections[tableName]) return instance
    // 主要用来判断表是否存在
    await instance.count()
    collections[tableName] = true
    return instance
  } catch (e) {
    if (e.code === 'DATABASE_COLLECTION_NOT_EXIST') {
      await db.createCollection(tableName)
      collections[tableName] = true
      return instance
    }
    throw e
  }
}

function idHandler(datas) {
  for (const data of datas) {
    data.id = data._id.toString()
    delete data._id
  }
  return datas
}

module.exports = async () => {
  try {
    const _ = db.command
    const adb = await collection(DISCUSS_DB_ADMIN)
    const mdb = await collection(DISCUSS_DB_COMMENT)
    const cdb = await collection(DISCUSS_DB_COUNTER)

    return {
      async addAdmin(data) {
        await adb.add(data)
      },
      async getAdmin() {
        const res = await adb.limit(1).get()
        const data = res.data[0]
        if (!data) return
        return idHandler([data])[0]
      },
      async updateAdmin(id, data) {
        await adb.doc(id).update(data)
      },
      fuzzyQueries(options, keyword, searchType) {
        const reg = new db.RegExp({ regexp: keyword, options: 'i' })
        if (searchType !== 'all') {
          options[searchType] = reg
        } else {
          const arr = ['nick', 'mail', 'site', 'ip', 'content', 'path']
          for (const i of arr) options[i] = _.or({ [i]: reg })
        }
        return options
      },
      async addComment(data) {
        const res = await mdb.add(data)
        return [await this.getCommentByID(res.id)]
      },
      async deleteComment(id) {
        await mdb.doc(id).delete()
      },
      async updateComment(id, data) {
        await mdb.doc(id).update(data)
      },
      async getTopComments(query) {
        const { data } = await mdb.where(query).orderBy('created', 'desc').get()
        return idHandler(data)
      },
      async getCommentByID(id) {
        const { data } = await mdb.where({ _id: id }).get()
        return idHandler(data)[0]
      },
      async getComment(query) {
        const res = await mdb.where(query).get()
        return idHandler(res.data)
      },
      async getComments(query, { page, pageSize }) {
        const stick = query.stick
        const condition = Array.isArray(stick) && stick[0] === '!=' && stick[1]
        if (condition) query.stick = _.neq(true)
        const { data } = await mdb
          .where(query)
          .orderBy('created', 'desc')
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .get()
        return idHandler(data)
      },
      async getRecentComment(query, limit) {
        const res = await mdb.where(query).orderBy('created', 'desc').limit(limit).get()
        return idHandler(res.data)
      },
      async getCommentCount(query) {
        const res = await mdb.where(query).count()
        return res.total
      },
      async getCommentCountLimit({ ip, created }) {
        const query = _.gt(Date.now() - created)
        if (ip) query.ip = ip
        const res = await mdb.where(query).count()
        return res.total
      },
      async addCounter(data) {
        await cdb.add(data)
      },
      async updateCounter({ path, updated }) {
        await cdb.where({ path }).update({ time: _.inc(1), updated: _.set(updated) })
      },
      async getCounter(path) {
        const res = await cdb.where({ path }).get()
        return idHandler(res.data)[0]
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
}
