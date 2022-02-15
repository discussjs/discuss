const minify = require('html-minifier').minify
const { readFileSync, existsSync } = require('fs')

/**
 * 压缩HTML
 * @param {String} path html文件路 or html文本内容
 * @returns
 */
function HtmlMinify(path) {
  const options = {
    minifyJS: true,
    minifyCSS: true,
    removeComments: true, // 删除注释
    collapseWhitespace: true, // 删除多余空白处
    removeAttributeQuotes: true // 删除属性引号
  }

  let content = ''
  if (existsSync(path)) {
    content = readFileSync(path, { encoding: 'utf8' })
  } else {
    content = path
  }

  return minify(content, options)
}

module.exports = HtmlMinify
