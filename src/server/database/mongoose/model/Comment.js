const mongoose = require('mongoose')

const { model, Schema } = mongoose

const CommentSchema = new Schema(
  {
    nick: { type: String, require: true },
    mail: { type: String, require: true },
    site: { type: String, require: true },
    content: { type: String, require: true },
    pid: { type: String, require: true },
    rid: { type: String, require: true },
    ip: { type: String, require: true },
    stick: { type: String, require: true, default: 'false' },
    master: { type: String, require: true, default: 'false' },
    status: { type: String, require: true, default: 'accept' },
    path: { type: String, require: true },
    created: { type: Number, require: true },
    updated: { type: Number, require: true },
    ua: { type: String, require: true },
    avatar: { type: String, require: true }
  },
  { versionKey: false }
)
const Comment = model('D_Comment', CommentSchema, 'D_comment')

module.exports = Comment
