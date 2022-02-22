import lazyload from './lib/lazyload'
import { createApp } from 'vue'
import request from './lib/request'
import Main from './Main.vue'
import VisitStat from './api/VisitStat'
import RecentComment from './api/RecentComment'
import CommentCount from './api/CommentCount'
import dialog from './lib/dialog'
import { setLanguage, translate } from './i18n/language'

const Discuss = {
  init,
  VisitStat,
  RecentComment,
  CommentCount
}

function defaultOptions() {
  return {
    master: translate('master'),
    stick: translate('stick'),
    ph: translate('content'),
    path: location.pathname,
    visitStat: true,
    imgLoading:
      'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw'
  }
}

let app

function init(options = {}) {
  setLanguage(options.lang).then(() => {
    options = Object.assign(defaultOptions(), options)
    app?.unmount()
    app = createApp(Main)
    const globalProperties = app.config.globalProperties
    globalProperties.$D = options
    globalProperties.$ajax = request
    globalProperties.$lazy = lazyload
    globalProperties.$dialog = dialog
    app.mount(options.el)
  })
}

export { Discuss }
