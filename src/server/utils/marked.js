const marked = require('marked')
const hljs = require('highlight.js')

// 判断是否以p标签开头
const reg = /^<p>.*?<\/p>$/gi

const HighlightRenderer = {
  renderer: new marked.Renderer(),
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  },
  langPrefix: 'hljs language-' // highlight.js css expects a top-level 'hljs' class.
}

const ImageRenderer = {
  image(src, title, text) {
    if (!src) return text
    let out = `<img d-src='${src}' alt='${text}' class='D-comment-img'`
    if (title) out += ` title='${title}'`
    out += this.options.xhtml ? '/>' : '>'
    return out
  }
}

/**
 * 渲染 markdown
 * @param {String} content 内容
 * @param {Boolean===String} isMarked 是否开启 marked
 * @param {Boolean===String} isHighlight 是否开启 highlight (代码高亮)
 * @returns content
 */

function MarkedHandler(content, isMarked, isHighlight) {
  // 代码高亮 (前提是必须和marked同时开启才会使用)
  if (isMarked && isHighlight) marked.setOptions(HighlightRenderer)

  // 处理图片class
  marked.use({ renderer: ImageRenderer })

  // 渲染marked 如果为false 则返回原内容
  if (isMarked) content = marked(content)

  if(!reg.test(content)) content = `<p>${content}</p>`

  return content
}

module.exports = MarkedHandler
