const { join } = require('path')

const { D_SQLITE_PATH, D_SQLITE_DB } = process.env

// 后缀名
const suffix = '.sqlite'

const reg = new RegExp(suffix + '$', 'i')

const db = reg.test(D_SQLITE_DB) ? D_SQLITE_DB : 'discuss' + suffix

process.env.D_SEQUELIZE_DB = JSON.stringify([
  {
    dialect: 'sqlite',
    storage: join(D_SQLITE_PATH, db)
  }
])

module.exports = async () => require('./sequelize')()
