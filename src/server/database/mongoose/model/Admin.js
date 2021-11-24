const { join } = require('path')
const mongoose = require('mongoose')
const { HtmlMinify } = require('../../../utils/minify')

const path = join(__dirname, '../../../../../public/mail.html')
const data = HtmlMinify(path)

const { model, Schema } = mongoose

const AdminSchema = new Schema(
  {
    username: { type: String, default: '', require: true },
    password: { type: String, default: '', require: true },
    mail: { type: String, default: '', require: true },
    domain: { type: String, default: '', require: true },
    site_name: { type: String, default: '', require: true },
    site_url: { type: String, default: '', require: true },

    akismet: { type: String, default: '', require: true },
    avatar_cdn: {
      type: String,
      default: 'https://cn.gravatar.com/avatar/',
      require: true
    },
    word_number: { type: String, default: 0, require: true },
    limit: { type: Number, default: 0, require: true },
    limitAll: { type: Number, default: 0, require: true },
    marked: { type: String, default: 'false', require: true },
    highlight: { type: String, default: 'false', require: true },

    mail_host: { type: String, default: '', require: true },
    mail_port: { type: String, default: '', require: true },
    mail_from: { type: String, default: '', require: true },
    mail_accept: { type: String, default: '', require: true },
    master_subject: { type: String, default: '', require: true },
    reply_subject: { type: String, default: '', require: true },
    mail_template: { type: String, default: data, require: true }
  },
  { versionKey: false } // 禁用__v字段
)
const admin = model('D_Admin', AdminSchema, 'D_admin')

module.exports = admin
