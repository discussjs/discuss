const xss = require('xss')

const FilterXSS = new xss.FilterXSS({
  // 不移除注释
  allowCommentTag: true,
  // 白名单为空，表示过滤所有标签
  whiteList: {
    img: ['class', 'src', 'alt']
  },

  /**
   * 自定义匹配到标签的属性时的处理方法
   * 如果返回一个字符串，则当前属性值将被替换为该字符串
   * @param {*} tag 是当前的标签名称，比如<a>标签，则tag的值是'a'
   * @param {*} name 是当前属性的名称，比如href="#"，则name的值是'href'
   * @param {*} value 是当前属性的值，比如href="#"，则value的值是'#'
   * @param {*} isWhiteAttr 是否为白名单上的属性
   * @returns
   */
  onTagAttr(tag, name, value) {
    if (tag === 'img') {
      if (name === 'class') return 'class="D-comment-emot"'
      if (name === 'src') {
        if (value.length > 500) return `src="${value.substring(0, 500)}"`
      }
      if (name === 'alt') {
        if (value.length > 50) return `alt="${value.substring(0, 50)}"`
      }
    }
  }
})

module.exports = (content) => {
  return FilterXSS.process(content)
}
