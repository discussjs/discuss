const { DISCUSS_DB_ADMIN, DISCUSS_DB_COMMENT, DISCUSS_DB_COUNTER } = process.env

module.exports = (type, options) => {
  const Model = require('dittorm')(type)
  const Admin = new Model(DISCUSS_DB_ADMIN || 'd_admin', options)
  const Comment = new Model(DISCUSS_DB_COMMENT || 'd_comment', options)
  const Counter = new Model(DISCUSS_DB_COUNTER || 'd_counter', options)
  return { Admin, Comment, Counter }
}
