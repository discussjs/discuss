const mongoose = require('mongoose')

const { model, Schema } = mongoose

const AdminSchema = new Schema(
  {
    username: { type: String, default: '', require: true },
    password: { type: String, default: '', require: true },
    mail: { type: String, default: '', require: true },
    domain: { type: String, default: '', require: true },
    request_headers: { type: String, default: '', require: true },

    // 评论处理
    comment_count: { type: Number, default: 6, require: true },
    word_number: { type: String, default: 0, require: true },
    limit: { type: Number, default: 0, require: true },
    limitAll: { type: Number, default: 0, require: true },
    akismet: { type: String, default: '', require: true },
    avatar_cdn: {
      type: String,
      default: 'https://cn.gravatar.com/avatar/',
      require: true
    },
    marked: {
      type: Object,
      default: {
        enable: false,
        source: 'https://cdn.jsdelivr.net/npm/marked@latest/marked.min.js'
      },
      require: true
    },
    highlight: {
      type: Object,
      default: {
        enable: false,
        source:
          'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@latest/build/highlight.min.js',
        theme:
          'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@latest/build/styles/default.min.css'
      },
      require: true
    },

    // 邮件提醒
    site_url: { type: String, default: '', require: true },
    serverURLs: { type: String, default: '', require: true },
    mail_host: { type: String, default: '', require: true },
    mail_port: { type: String, default: '', require: true },
    mail_from: { type: String, default: '', require: true },
    mail_accept: { type: String, default: '', require: true },
    master_subject: { type: String, default: '', require: true },
    master_template: { type: String, default: '', require: true },
    reply_subject: { type: String, default: '', require: true },
    reply_template: { type: String, default: '', require: true }
  },
  { versionKey: false } // 禁用__v字段
)
const admin = model('D_Admin', AdminSchema, 'D_admin')

module.exports = admin
