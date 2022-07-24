const { D_MYSQL_URL } = process.env

process.env.D_SEQUELIZE_DB = JSON.stringify([D_MYSQL_URL])

module.exports = async () => require('./sequelize')()
