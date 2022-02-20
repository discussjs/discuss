const http = require('http')
const main = require('./main')

let PORT = process.env.PORT || process.env.DISCUSS_PORT || 6870

async function init() {
  const server = http.createServer(main)
  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log('Service is up and running port: ' + PORT)
  })
}

module.exports = init
