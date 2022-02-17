let language

/**
 * 设置语言
 * @param {String} lang 语言 默认: zh_CN
 */
async function setLanguage(lang) {
  let useLang = lang || 'zh_CN'
  const resultLanguage = await import(
    /* webpackChunkName: "[request]" */ './' + useLang
  )
  language = resultLanguage.default
}

/**
 * 动态获取对象属性值
 * @param {*} obj
 * @param {*} str
 * @returns
 */
function GetProperty(obj, str) {
  str = str.replace(/\[(\w+)\]/g, '.$1') // 处理数组下标
  let arr = str.split('.')
  for (let i in arr) obj = obj[arr[i]] ?? ''
  return obj
}

/**
 * 翻译
 * @param {String} key i18n的key
 * @returns {String} 对应的语言字段
 */
function translate(key) {
  return GetProperty(language, key)
}

export { setLanguage, translate }
