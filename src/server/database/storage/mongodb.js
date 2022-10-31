const { MongoClient, ObjectId } = require('mongodb')
const { DeepClone } = require('../../utils')

const {
  D_MONGO_URL,
  DISCUSS_DB_ADMIN = 'd_admin',
  DISCUSS_DB_COMMENT = 'd_comment',
  DISCUSS_DB_COUNTER = 'd_counter'
} = process.env

const D_DB_NAME = 'discuss'

let db

async function connectDatabase() {
  if (db) return

  const options = { useNewUrlParser: true, useUnifiedTopology: true }
  const client = await MongoClient.connect(D_MONGO_URL, options)

  const dbName = new URL(D_MONGO_URL).pathname.substring(1)
  db = await client.db(dbName || D_DB_NAME)
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
    await connectDatabase()

    const databaseFn = {
      async addAdmin(data) {
        await db.collection(DISCUSS_DB_ADMIN).insertOne(data)
      },
      async getAdmin() {
        const datas = await db.collection(DISCUSS_DB_ADMIN).findOne({})
        if (!datas) return
        return idHandler([datas])[0]
      },
      async updateAdmin(id, data) {
        await db.collection(DISCUSS_DB_ADMIN).updateOne({ _id: ObjectId(id) }, { $set: data })
      },
      fuzzyQueries(options, keyword, searchType) {
        const reg = new RegExp(keyword, 'i')
        if (searchType !== 'all') {
          options[searchType] = reg
        } else {
          const arr = ['nick', 'mail', 'site', 'ip', 'content', 'path']
          options.$or = []
          for (const i of arr) options.$or.push({ [i]: { $regex: reg } })
        }
        return options
      },
      async addComment(data) {
        const res = await db.collection(DISCUSS_DB_COMMENT).insertOne(data)
        return [await databaseFn.getCommentByID(res.insertedId.toString())]
      },
      async deleteComment(id) {
        await db.collection(DISCUSS_DB_COMMENT).deleteOne({ _id: ObjectId(id) })
      },
      async updateComment(id, data) {
        await db.collection(DISCUSS_DB_COMMENT).updateOne({ _id: ObjectId(id) }, { $set: data })
      },
      async getTopComments(query) {
        return idHandler(await db.collection(DISCUSS_DB_COMMENT).find(query).sort({ created: -1 }).toArray())
      },
      async getCommentByID(id) {
        const data = await db
          .collection(DISCUSS_DB_COMMENT)
          .find({ _id: ObjectId(id) })
          .toArray()
        return idHandler(data)[0]
      },
      async getComment(query) {
        // 不知道为什么 mongodb 直接传入 query 查不出来数据，得深度克隆后才可以查出
        query = DeepClone(query)
        return idHandler(await db.collection(DISCUSS_DB_COMMENT).find(query).toArray())
      },
      async getComments(query, { page, pageSize }) {
        const stick = query.stick
        const condition = Array.isArray(stick) && stick[0] === '!=' && stick[1]
        if (condition) query.stick = { $ne: true }
        return idHandler(
          await db
            .collection(DISCUSS_DB_COMMENT)
            .find(query)
            .sort({ created: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray()
        )
      },
      async getRecentComment(query, limit) {
        return await db.collection(DISCUSS_DB_COMMENT).find(query).sort({ created: -1 }).limit(limit).toArray()
      },
      async getCommentCount(query) {
        return await db.collection(DISCUSS_DB_COMMENT).countDocuments(query)
      },
      async getCommentCountLimit({ ip, created }) {
        const query = { created: { $gt: Date.now() - created } }
        if (ip) query.ip = ip
        return await db.collection(DISCUSS_DB_COMMENT).countDocuments(query)
      },
      async addCounter(data) {
        await db.collection(DISCUSS_DB_COUNTER).insertOne(data)
      },
      async updateCounter({ path, updated }) {
        await db.collection(DISCUSS_DB_COUNTER).updateOne({ path }, { $inc: { time: 1 }, $set: { updated } })
      },
      async getCounter(path) {
        const res = await db.collection(DISCUSS_DB_COUNTER).findOne({ path })
        if (!res) return
        return idHandler([res])[0]
      }
    }
    return databaseFn
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
}
