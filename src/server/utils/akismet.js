const { AkismetClient } = require('akismet-api')

/**
 * 垃圾评论检测
 * @param {*} key Akismet Key
 * @param {*} blog Blog URL
 * @param {*} comment Comment Content Info
 * @returns Is Spam Comment
 */
/* eslint-disable no-console */
async function AkismetHandler(key, blog, comment) {
  if (!key) {
    console.log('Not Set Akismet')
    return 'accept'
  }
  try {
    // 密钥/博客
    const client = new AkismetClient({ key, blog })

    // 验证你要是否有效
    const isValid = await client.verifyKey()
    if (!isValid) {
      console.log('Akismet key not applicable!')
      return 'accept'
    }

    // 检查垃圾评论
    const isSpam = await client.checkSpam(comment)
    if (isSpam) {
      console.log('Found a spam comment!')
      return 'spam'
    } else {
      return 'accept'
    }
  } catch (err) {
    console.error('Spam comment detection exception:', err)
  }
}

module.exports = AkismetHandler
