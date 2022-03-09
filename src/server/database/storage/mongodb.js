const {
  D_MONGO_HOST,
  D_MONGO_PORT,
  D_MONGO_DB,
  D_MONGO_USER,
  D_MONGO_PASSWORD,
  D_MONGO_REPLICASET,
  D_MONGO_AUTHSOURCE,
  D_MONGO_SSL
} = process.env

const dbOptions = {}
if (D_MONGO_REPLICASET) dbOptions.replicaset = D_MONGO_REPLICASET
if (D_MONGO_AUTHSOURCE) dbOptions.authSource = D_MONGO_AUTHSOURCE
if (D_MONGO_SSL) dbOptions.ssl = D_MONGO_SSL

module.exports = {
  host: D_MONGO_HOST
    ? D_MONGO_HOST.startsWith('[')
      ? JSON.parse(D_MONGO_HOST) // 如果是 [xxx, xxx] 数组格式则解析为数组，否则不解析
      : D_MONGO_HOST
    : '127.0.0.1', // 如果 D_MONGO_HOST 为 null 或 undefined 则使用 127.0.0.1
  port: D_MONGO_PORT
    ? D_MONGO_PORT.startsWith('[')
      ? JSON.parse(D_MONGO_PORT)
      : D_MONGO_PORT
    : 27017,
  database: D_MONGO_DB || 'Discuss',
  user: D_MONGO_USER,
  password: D_MONGO_PASSWORD,
  options: dbOptions
}
