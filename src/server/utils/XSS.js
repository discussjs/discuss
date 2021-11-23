const xss = require('xss')

const FilterXSS = new xss.FilterXSS({
  /**
   *
   * @param {*} tag 标签
   * @param {*} attributeName 属性名
   * @param {*} attributeValue
   * @returns String
   */
  onIgnoreTagAttr(tag, attributeName, attributeValue) {
    const isEmot =
      tag == 'img' &&
      attributeName == 'class' &&
      attributeValue == 'D-emot-comment'
    if (isEmot) return `${attributeName}='${attributeValue}'`
  }
})

function XSSHandler(content) {
  return FilterXSS.process(content)
}

module.exports = XSSHandler
