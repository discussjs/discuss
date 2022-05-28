const {
  D_MONGO_URL,
  D_MONGO_HOST,
  D_MONGO_PORT,
  D_MONGO_DB,
  D_MONGO_USER,
  D_MONGO_PASSWORD,
  D_MONGO_REPLICASET,
  D_MONGO_AUTHSOURCE,
  D_MONGO_SSL
} = process.env

// 自动拆分
const parseOpt = {}
if (D_MONGO_URL) {
  const protocol = 'mongodb://'
  let split = D_MONGO_URL.split(',')

  // 正则: ^mongodb:\/\/.*
  const reg = new RegExp('^' + protocol + '.*')

  // 加协议
  const urls = []
  for (let i of split) {
    if (reg.test(i)) urls.push(i)
    else urls.push(protocol + i)
  }

  // 解析
  const url1 = new URL(urls[0])
  const url2 = new URL(urls[1])
  const url3 = new URL(urls[2])

  // url1
  parseOpt.host = []
  parseOpt.host.push(url1.hostname)
  parseOpt.port = []
  parseOpt.port.push(url1.port)

  parseOpt.user = url1.username
  parseOpt.password = url1.password

  // url2
  parseOpt.host.push(url2.hostname)
  parseOpt.port.push(url2.port)

  // url3
  parseOpt.host.push(url3.hostname)
  parseOpt.port.push(url3.port)
  parseOpt.database = url3.pathname.replace(/^\//, '')

  parseOpt.options = {}
  const params = url3.searchParams.entries()
  for (const i of params) parseOpt.options[i[0]] = i[1]
}

const dbOptions = {}
if (D_MONGO_REPLICASET) dbOptions.replicaset = D_MONGO_REPLICASET
if (D_MONGO_AUTHSOURCE) dbOptions.authSource = D_MONGO_AUTHSOURCE
if (D_MONGO_SSL) dbOptions.ssl = D_MONGO_SSL

let options = {
  host: D_MONGO_HOST
    ? D_MONGO_HOST.startsWith('[')
      ? JSON.parse(D_MONGO_HOST) // 如果是 [xxx, xxx] 数组格式则解析为数组，否则不解析
      : D_MONGO_HOST
    : '127.0.0.1', // 如果 D_MONGO_HOST 为 null 或 undefined 则使用 127.0.0.1
  port: D_MONGO_PORT ? (D_MONGO_PORT.startsWith('[') ? JSON.parse(D_MONGO_PORT) : D_MONGO_PORT) : 27017,
  database: D_MONGO_DB || 'Discuss',
  user: D_MONGO_USER,
  password: D_MONGO_PASSWORD,
  options: dbOptions
}

if (JSON.stringify(parseOpt) !== '{}') options = parseOpt

module.exports = options
