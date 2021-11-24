const minify = require('html-minifier').minify
const { readFileSync, existsSync } = require('fs')

/**
 * 压缩HTML
 * @param {String} path html文件地址
 * @returns
 */
function HtmlMinify(path) {
  if (!existsSync(path)) return '这里什么都没有哦 OwO !'
  const options = {
    minifyJS: true,
    minifyCSS: true,
    removeComments: true, // 删除注释
    collapseWhitespace: true, // 删除多余空白处
    removeAttributeQuotes: true // 删除属性引号
  }
  const content = readFileSync(path, { encoding: 'utf8' })
  const result = minify(content, options)
  return result
}

module.exports = {
  HtmlMinify
}
