const nodemailer = require('nodemailer')

async function SendMail(options) {
  let transporter = nodemailer.createTransport({
    host: options.host,
    port: options.port,
    secure: true,
    auth: {
      user: options.user,
      pass: options.pass
    }
  })

  let mail = {
    from: options.from,
    to: options.to,
    subject: options.subject,
    html: options.html
  }

  // 验证 SMTP 配置
  try {
    const success = await transporter.verify()
    if (success) console.log('SMTP 邮箱配置正常')
  } catch (error) {
    throw new Error('SMTP 邮箱配置异常：', error)
  }

  // 验证成功 开始发送
  try {
    const success = await transporter.sendMail(mail)
    if (success) {
      console.log('SMTP 邮箱通知成功')
      console.log('SMTP 邮箱通知细节:', success)
    }
  } catch (error) {
    throw new Error('SMTP 邮箱通知异常：', error)
  }
}
module.exports = SendMail
