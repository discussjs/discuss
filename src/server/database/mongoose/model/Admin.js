const mongoose = require('mongoose')

const { model, Schema } = mongoose

const AdminSchema = new Schema(
  {
    username: { type: String, default: '', require: true },
    password: { type: String, default: '', require: true },
    mail: { type: String, default: '', require: true },
    domain: { type: String, default: '', require: true },
    requestHeaders: { type: String, default: '', require: true },

    // 评论处理
    commentCount: { type: Number, default: 6, require: true },
    wordNumber: { type: String, default: 0, require: true },
    limit: { type: Number, default: 0, require: true },
    limitAll: { type: Number, default: 0, require: true },
    akismet: { type: String, default: '', require: true },
    avatarCdn: {
      type: String,
      default: 'https://cravatar.cn/avatar/',
      require: true
    },

    // 邮件提醒
    siteUrl: { type: String, default: '', require: true },
    serverURLs: { type: String, default: '', require: true },
    mailHost: { type: String, default: '', require: true },
    mailPort: { type: String, default: '', require: true },
    mailFrom: { type: String, default: '', require: true },
    mailAccept: { type: String, default: '', require: true },
    masterSubject: { type: String, default: '', require: true },
    masterTemplate: { type: String, default: '', require: true },
    replySubject: { type: String, default: '', require: true },
    replyTemplate: { type: String, default: '', require: true }
  },
  { versionKey: false } // 禁用__v字段
)
const admin = model('D_Admin', AdminSchema, 'D_admin')

module.exports = admin
