const { D_PG_DB, D_PG_HOST, D_PG_PASSWORD, D_PG_PORT, D_PG_USER } = process.env

module.exports = {
  host: D_PG_HOST || '127.0.0.1',
  port: D_PG_PORT || 5432,
  database: D_PG_DB || 'Discuss',
  user: D_PG_USER,
  password: D_PG_PASSWORD
}
