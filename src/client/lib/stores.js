import { writable } from 'svelte/store'
import massage from './massage'
import lazyload from './lazyload'

export const options = writable({})
export const openMenu = writable(false)
export const showSetting = writable(true)
export const msg = writable(massage)
export const lazy = writable(lazyload)
