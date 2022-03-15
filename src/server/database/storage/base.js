module.exports = (type, options) => {
  const Model = require('dittorm')(type)
  const Admin = new Model('d_admin', options)
  const Comment = new Model('d_comment', options)
  const Counter = new Model('d_counter', options)
  return { Admin, Comment, Counter }
}
