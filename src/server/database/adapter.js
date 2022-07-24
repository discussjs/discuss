const { DISCUSS_DB_TYPE } = process.env

module.exports = async () => {
  try {
    let db = (DISCUSS_DB_TYPE || '').toLowerCase()
    // eslint-disable-next-line no-console
    console.log('Use db type:', db)
    if (!db) throw new Error('No matching database found')
    return await require('./storage/' + db)()
  } catch (error) {
    /* eslint-disable no-console */
    console.error('Discuss: Database connect fault')
    console.error(error)
    /* eslint-enable */
  }
}
