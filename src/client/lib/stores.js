import { writable } from 'svelte/store'
import msgAlert from 'msg-alert'
import lazyload from './lazyload'

function massage(options) {
  const all = [...document.body.querySelectorAll('*')].map((el) => +window.getComputedStyle(el).zIndex || 0)
  options.zIndex = Math.max(...all) + 1
  msgAlert(options)
}

export const options = writable({})
export const openMenu = writable(false)
export const showSetting = writable(true)
export const msg = writable(massage)
export const lazy = writable(lazyload)
