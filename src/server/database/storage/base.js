module.exports = (type, options) => {
  const Model = require('dittorm')(type)
  const Admin = new Model('D_admin', options)
  const Comment = new Model('D_comment', options)
  const Counter = new Model('D_counter', options)
  return { Admin, Comment, Counter }
}
