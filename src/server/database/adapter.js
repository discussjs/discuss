const base = require('./storage/base')

module.exports = () => {
  try {
    const db = process.env.DISCUSS_DB_TYPE
    switch (db) {
      case 'mongodb':
        return base(db, require('./storage/mongodb'))
      case 'mysql':
        return base(db, require('./storage/mysql'))
      case 'cloudbase':
        return base(db, require('./storage/cloudbase'))
      case 'deta':
        return base(db, require('./storage/deta'))
      case 'leancloud':
        return base(db, require('./storage/leancloud'))
      case 'postgresql':
        return base(db, require('./storage/postgresql'))
      case 'sqlite':
        return base(db, require('./storage/sqlite'))
      default:
        throw new Error('No matching database found')
    }
  } catch (error) {
    /* eslint-disable no-console */
    console.error('Discuss: Database connect fault')
    console.error(error)
    /* eslint-enable */
  }
}
