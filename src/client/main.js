import gif1px from 'min-1px'
import Main from './view/main.svelte'
import { options } from './lib/stores'
import { translate, setLanguage } from './i18n'
import getVisitStat from './api/VisitStat'
import getRecentComment from './api/RecentComment'
import getCommentCount from './api/CommentCount'

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

/* eslint-disable no-console */
function warn(fun) {
  console.warn('Disucss:', `"${fun}" will be removed in a future version, please use "get${fun}" instead.`)
}
async function VisitStat(...params) {
  warn('VisitStat')
  return await getVisitStat(...params)
}
async function RecentComment(...params) {
  warn('RecentComment')
  return await getRecentComment(...params)
}
async function CommentCount(...params) {
  warn('CommentCount')
  return await getCommentCount(...params)
}
/* eslint-enable no-console */

export default window.Discuss = {
  init,
  getVisitStat,
  getRecentComment,
  getCommentCount,
  VisitStat,
  RecentComment,
  CommentCount
}
