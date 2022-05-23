import cn from './cn.json'
import en from './en.json'

let language

function setLanguage(lang) {
  if (lang === 'en') language = en
  else language = cn
}

/**
 * 动态获取对象属性值
 * @param {*} obj
 * @param {*} str
 * @returns
 */
function translate(key) {
  key = key.replace(/\[(\w+)\]/g, '.$1') // 处理数组下标
  let arr = key.split('.')
  let obj = { ...language }
  for (let i in arr) obj = obj[arr[i]] ?? ''
  return obj
}

export { translate, setLanguage }
