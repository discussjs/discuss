const str = 'D-zIndex'

/**
 * 让 admin 显示在最顶层
 * @param {String} flag open or close
 */
export default function (flag) {
  const adminWrap = [...document.querySelectorAll('.D-admin-wrap *')]
  const all = [...document.body.querySelectorAll('*:not(._msg)')]
  all.forEach((el) => {
    if (adminWrap.includes(el)) return
    const zIndex = window.getComputedStyle(el).zIndex
    if (flag === 'close') return el.classList.remove(str)

    if (flag === 'open' && zIndex > 0) el.classList.add(str)
  })

  let body,
    el = document.querySelector('#Discuss')

  while (body !== 'BODY') {
    el = el.parentElement
    body = el.nodeName
    if (el.classList.contains(str)) el.classList.remove(str)
  }
}
