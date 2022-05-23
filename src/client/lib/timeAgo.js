import { translate } from '../i18n'

// padStart 如果长度达不到指定长度(2)使用指定字符(0)填充到内容前面(padEnd填充到后面)
// 日期格式化
function Format(timestamp) {
  const time = new Date(timestamp)
  const year = time.getFullYear()
  const month = (time.getMonth() + 1).toString().padStart(2, 0)
  const date = time.getDate().toString().padStart(2, 0)
  return `${year}-${month}-${date}`
}

export default function timeAgo(timestamp) {
  const diffValue = Date.now() - timestamp

  const minute = 1000 * 60 // 60000ms
  const hour = minute * 60 // 3600000ms
  const day = hour * 24 // 86400000ms

  const intDay = parseInt(diffValue / day)
  const intHour = parseInt(diffValue / hour)
  const intMinute = parseInt(diffValue / minute)

  const { now, minutes, hours, days } = translate('timeAgo')

  if (intMinute === 0) return now
  else if (intMinute < 64) return intMinute + minutes
  else if (intHour < 24) return intHour + hours
  else if (intDay < 7) return intDay + days
  else return Format(timestamp)
}
