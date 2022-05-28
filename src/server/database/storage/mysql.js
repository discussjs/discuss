const { D_MYSQL_HOST, D_MYSQL_PORT, D_MYSQL_DB, D_MYSQL_USER, D_MYSQL_PASSWORD, D_MYSQL_CHARSET } = process.env

module.exports = {
  host: D_MYSQL_HOST || '127.0.0.1',
  port: D_MYSQL_PORT || 3306,
  database: D_MYSQL_DB || 'Discuss',
  user: D_MYSQL_USER,
  password: D_MYSQL_PASSWORD,
  charset: D_MYSQL_CHARSET || 'utf8mb4'
}
