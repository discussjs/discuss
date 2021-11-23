import { createApp } from 'vue'
import Main from './Main.vue'

const defaultOptions = {
  master: '博主',
  placeholder: '快来评论呀',
  path: window.location.pathname,
  marked: {
    gfm: true,
    breaks: true,
    smartLists: true,
    smartypants: true,
    source: 'https://cdn.jsdelivr.net/npm/marked@latest/marked.min.js',
    highlightjs: {
      source:
        'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@latest/build/highlight.min.js',
      theme:
        'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@latest/build/styles/default.min.css'
    }
  }
}

function Discuss(options) {
  options.marked = options.marked || defaultOptions.marked
  options.marked.highlightjs =
    options.marked.highlightjs || defaultOptions.marked.highlightjs

  // 挂载vue组件
  const app = createApp(Main)
  app.config.globalProperties.$D = options // 全局属性
  app.mount(options.el)
}

export default Discuss
export { Discuss }
