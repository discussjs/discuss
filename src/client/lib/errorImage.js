
/**
 * 处理错误头像
 * @param {Event} event
 */
function onError(event) {
  const img = event.target
  let favicon = ''
  let linkList = document.querySelectorAll('head link[rel]')

  for (const ele of linkList) {
    let rel = ele.getAttribute('rel')
    const flag = ['icon', 'shortcut', 'shortcut icon']
    if (flag.includes(rel) && !favicon) {
      favicon = ele.getAttribute('href')
      img.src = favicon
    }
  }
}

export default onError
