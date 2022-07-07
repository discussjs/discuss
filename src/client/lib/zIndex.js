const str = 'D-zIndex'

/**
 * 让 admin 显示在最顶层
 * @param {String} flag open or close
 */
export default function (flag) {
  const all = [...document.body.querySelectorAll('*:not(._msg)')]
  all.forEach((el) => {
    const zIndex = window.getComputedStyle(el).zIndex
    if (flag === 'close') {
      el.classList.remove(str)
      el.style.removeProperty('z-index')
      return
    }
    if (flag === 'open' && zIndex > 0) {
      el.style.zIndex = -1
      el.classList.add(str)
    }
  })

  let body,
    el = document.querySelector('#Discuss')

  while (body !== 'BODY') {
    el = el.parentElement
    body = el.nodeName
    if (el.classList.contains(str)) {
      el.style.removeProperty('z-index')
    }
  }
}
