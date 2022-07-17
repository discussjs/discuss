import Main from './view/admin.svelte'
import { options } from './lib/stores'
import { translate, setLanguage } from './i18n'

let app

function init(opt) {
  opt = opt || {}
  setLanguage(opt.lang)
  const defaultOptions = {
    master: translate('master'),
    stick: translate('stick'),
    ph: translate('content'),
    path: location.pathname,
    visitStat: true,
    imgLoading: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw'
  }
  options.set(Object.assign(defaultOptions, opt))
  app && app.$destroy()
  app = new Main({
    target: document.querySelector(opt.el),
    props: { show: opt.show } // 是否显示关闭以及退出登录按钮
  })
  return app
}

export default window.DiscussAdmin = { init }
