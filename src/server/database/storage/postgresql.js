const { D_PG_URL } = process.env

process.env.D_SEQUELIZE_DB = JSON.stringify([D_PG_URL])

let sequelizeConfig = {
  dialectModule: require('pg'),
  dialectOptions: {
    ssl: true
  }
}

module.exports = async () => require('./sequelize')(sequelizeConfig)
