const axios = require('axios')
const md5 = require('md5')

const QQMail = /^([1-9][0-9]{5,10})@qq.com$/i

async function QQAvatar(mail) {
  mail.replace(QQMail, '')
  const QQ = RegExp.$1

  let url = `https://ptlogin2.qq.com/getface?appid=1006102&uin=${QQ}&imgtype=3`

  const result = await axios.get(url)

  if (!result && !result.data) return false

  const start = result.data.indexOf('http')
  const end = result.data.indexOf('"', start)
  if (start === -1 || end === -1) return false
  return result.data.substring(start, end)
}

function Avatar(mail) {
  return md5(mail)
}

async function GetAvatar(mail) {
  if (QQMail.test(mail)) return await QQAvatar(mail)

  return Avatar(mail)
}

module.exports = GetAvatar
