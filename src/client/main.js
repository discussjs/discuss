import gif1px from 'min-1px'
import Main from './view/main.svelte'
import { options } from './lib/stores'
import { translate, setLanguage } from './i18n'
import VisitStat from './api/VisitStat'
import RecentComment from './api/RecentComment'
import CommentCount from './api/CommentCount'

let app
function init(opt) {
  window.DLoad = false
  opt = opt || {}
  setLanguage(opt.lang)
  const defaultOptions = {
    master: translate('master'),
    stick: translate('stick'),
    ph: translate('content'),
    path: location.pathname,
    visitStat: true,
    imgLoading: gif1px.GIF
  }

  options.set(Object.assign(defaultOptions, opt))

  app && app.$destroy()
  app = new Main({
    target: document.querySelector(opt.el)
  })
  // 设置主色
  if (opt.color) {
    const style = document.createElement('style')
    style.textContent = `:root{--D-main-Color:${opt.color}}`
    document.head.appendChild(style)
  }
}

export default { init, VisitStat, RecentComment, CommentCount }
