import { createApp } from 'vue'
import Main from './Main.vue'
import VisitStat from './api/VisitStat'
import RecentComment from './api/RecentComment'
import CommentCount from './api/CommentCount'

const Discuss = {
  init,
  VisitStat,
  RecentComment,
  CommentCount
}

const defaultOptions = {
  master: '博主',
  placeholder: '快来评论呀',
  path: location.pathname,
  marked: {
    gfm: true,
    breaks: true,
    smartLists: true,
    smartypants: true
  }
}

function init(options = {}) {
  options.marked = options.marked || defaultOptions.marked

  // 挂载vue组件
  const app = createApp(Main)
  app.config.globalProperties.$D = options // 全局属性
  app.mount(options.el)
}

export { Discuss }
