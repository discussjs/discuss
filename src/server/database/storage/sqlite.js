const { D_SQLITE_PATH, D_SQLITE_DB } = process.env

module.exports = {
  path: D_SQLITE_PATH,
  database: D_SQLITE_DB || 'Discuss'
}
