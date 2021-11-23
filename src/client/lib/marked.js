import { getScript, getLink } from 'loading-script'

const remove = { remove: false } // loading-script 后是否删除js DOM
let flagMarked = false
let flagHighlight = false

const renderer = {
  image(src, title, text) {
    if (!src) return text
    let out = `<img src='${src}' alt='${text}' class='D-comment-img'`
    if (title) out += ` title='${title}'`
    out += this.options.xhtml ? '/>' : '>'
    return out
  }
}

// 解析 markdown or 代码高亮
async function parse(MarkedOption, content, enable) {
  // enable 为空则继续往下执行
  if (enable) {
    if (!MarkedOption.highlightjs.enable) {
      marked.use({ renderer })
      content = marked.parse(content)
      return content
    }
    return await GetHighlight(MarkedOption, content, renderer)
  }
  // 处理代码高亮
  const defaultConfig = {
    renderer: new marked.Renderer(),
    highlight: function (code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
    langPrefix: 'hljs language-' // highlight.js css expects a top-level 'hljs' class.
  }
  const config = Object.assign(MarkedOption, defaultConfig)
  marked.setOptions(config)
  marked.use({ renderer })
  return marked.parse(content)
}

// 解析markdown
async function parseMarked(MarkedOption, content) {
  if (!MarkedOption.enable) return content
  return await GetMarked(MarkedOption, content)
}

// 处理markdown
function GetMarked(MarkedOption, content) {
  return new Promise(async (resolve, reject) => {
    // 限制请求
    if (flagMarked) {
      content = await parse(MarkedOption, content, true)
      resolve(content)
    } else {
      getScript(
        MarkedOption.source,
        async () => {
          flagMarked = true
          content = await parse(MarkedOption, content, true)
          resolve(content)
        },
        remove
      )
    }
  })
}

// 处理代码高亮
function GetHighlight(MarkedOption, content) {
  const head = document.querySelector('head').innerHTML
  const isExistHljsStyle =
    head.indexOf(MarkedOption.highlightjs.theme) != -1 ? true : false
  if (!isExistHljsStyle) getLink(MarkedOption.highlightjs.theme)
  return new Promise((resolve, reject) => {
    // 限制请求
    if (flagHighlight) {
      content = parse(MarkedOption, content)
      resolve(content)
    } else {
      getScript(
        MarkedOption.highlightjs.source,
        () => {
          flagHighlight = true
          content = parse(MarkedOption, content)
          resolve(content)
        },
        remove
      )
    }
  })
}

export default parseMarked
