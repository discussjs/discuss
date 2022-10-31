const { Sequelize, DataTypes, Op } = require('sequelize')

const {
  D_SEQUELIZE_DB,
  DISCUSS_DB_ADMIN = 'd_admin',
  DISCUSS_DB_COMMENT = 'd_comment',
  DISCUSS_DB_COUNTER = 'd_counter'
} = process.env

const sequelize = new Sequelize(JSON.parse(D_SEQUELIZE_DB)[0])

const ModelOptions = { freezeTableName: true, timestamps: false }

const AdminModel = {
  id: {
    type: DataTypes.STRING(24),
    allowNull: false,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  domain: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false
  },
  requestHeaders: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false
  },

  // 评论处理
  commentCount: {
    type: DataTypes.BIGINT,
    defaultValue: 6,
    allowNull: false
  },
  wordNumber: {
    type: DataTypes.STRING,
    defaultValue: '0',
    allowNull: false
  },
  limit: {
    type: DataTypes.STRING,
    defaultValue: 0,
    allowNull: false
  },
  limitAll: {
    type: DataTypes.STRING,
    defaultValue: 0,
    allowNull: false
  },
  akismet: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false
  },
  avatarCdn: {
    type: DataTypes.STRING,
    defaultValue: 'https://cravatar.cn/avatar/',
    allowNull: false
  },

  // 邮件提醒
  siteUrl: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false
  },
  serverURLs: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false
  },
  mailHost: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false
  },
  mailPort: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false
  },
  mailFrom: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false
  },
  mailAccept: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false
  },
  masterSubject: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false
  },
  masterTemplate: {
    type: DataTypes.TEXT,
    defaultValue: '',
    allowNull: false
  },
  replySubject: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false
  },
  replyTemplate: {
    type: DataTypes.TEXT,
    defaultValue: '',
    allowNull: false
  }
}
const Admin = sequelize.define(DISCUSS_DB_ADMIN, AdminModel, ModelOptions)

const CommentModel = {
  id: {
    type: DataTypes.STRING(24),
    allowNull: false,
    primaryKey: true
  },
  nick: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false
  },
  mail: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false
  },
  site: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  ip: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false
  },
  pid: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false
  },
  rid: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false
  },
  stick: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(10),
    defaultValue: 'accept',
    allowNull: false
  },
  path: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false
  },
  created: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  updated: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  ua: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}
const Comment = sequelize.define(DISCUSS_DB_COMMENT, CommentModel, ModelOptions)

const CounterModel = {
  id: {
    type: DataTypes.STRING(24),
    allowNull: false,
    primaryKey: true
  },
  time: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
    allowNull: false
  },
  path: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false
  },
  created: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  updated: {
    type: DataTypes.BIGINT,
    allowNull: false
  }
}
const Counter = sequelize.define(DISCUSS_DB_COUNTER, CounterModel, ModelOptions)

function findAllHandler(datas) {
  const result = []
  for (const data of datas) result.push(data.dataValues)
  return result
}

module.exports = async () => {
  await sequelize.sync()
  return {
    async addAdmin(data) {
      await Admin.create(data)
    },
    async getAdmin() {
      const res = await Admin.findOne()
      return res && res.dataValues
    },
    async updateAdmin(id, data) {
      await Admin.update(data, { where: { id } })
    },
    fuzzyQueries(options, keyword, searchType) {
      if (searchType !== 'all') {
        options[searchType] = { [Op.like]: `%${keyword}%` }
      } else {
        const arr = ['nick', 'mail', 'site', 'ip', 'content', 'path']
        options[Op.or] = []
        for (const i of arr) options[Op.or].push({ [i]: { [Op.like]: `%${keyword}%` } })
      }
      return options
    },
    async addComment(data) {
      const res = await Comment.create(data)
      return [res.dataValues]
    },
    async deleteComment(id) {
      await Comment.destroy({ where: { id } })
    },
    async updateComment(id, data) {
      await Comment.update(data, { where: { id } })
    },
    async getTopComments(query) {
      const res = await Comment.findAll({ where: query, order: [['created', 'DESC']] })
      return res && res.length ? findAllHandler(res) : res
    },
    async getCommentByID(id) {
      const res = await Comment.findOne({ where: { id } })
      return res && res.dataValues
    },
    async getComment(query) {
      const res = await Comment.findAll({ where: query })
      return res && res.length ? findAllHandler(res) : res
    },
    async getComments(query, { page, pageSize }) {
      const stick = query.stick
      const condition = Array.isArray(stick) && stick[0] === '!=' && stick[1]
      if (condition) query.stick = { [Op.ne]: true }
      const res = await Comment.findAll({
        where: query,
        order: [['created', 'DESC']],
        offset: (page - 1) * pageSize,
        limit: pageSize
      })
      return res && res.length ? findAllHandler(res) : res
    },
    async getRecentComment(query, limit) {
      const res = await Comment.findAll({ where: query, order: [['created', 'DESC']], limit })
      return res && res.length ? findAllHandler(res) : res
    },
    async getCommentCount(query) {
      return await Comment.count({ where: query })
    },
    async getCommentCountLimit({ ip, created }) {
      const query = { created: { [Op.gt]: Date.now() - created } }
      if (ip) query.ip = ip
      return await Comment.count({ where: query })
    },
    async addCounter(data) {
      await Counter.create(data)
    },
    async updateCounter({ path }) {
      await Counter.increment({ time: 1 }, { where: { path } })
    },
    async getCounter(path) {
      const res = await Counter.findOne({ where: { path } })
      return res && res.dataValues
    }
  }
}
