const md5 = require('md5')

module.exports = (sum = 24) => {
  const random = Math.random()
  const radix = random.toString(36)
  const slice = radix.slice(2)

  const result = md5(slice + Date.now())
  return result.substring(0, sum)
}
