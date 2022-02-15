const defaultMsec = 4000
const dialogStr = 'D-dialog'
const dialogWrapStr = dialogStr + '-wrap'
const appear = dialogStr + '-appear'

let wrap

export default (msg, delay = defaultMsec) => {
  if (!wrap) wrap = document.querySelector('#Discuss>.' + dialogWrapStr)
  if (!msg) return

  const div = document.createElement('div')
  div.innerText = msg
  div.classList.add(dialogStr)
  wrap.appendChild(div)

  setTimeout(() => div.classList.add(appear), 100)
  setTimeout(() => {
    div.classList.remove(appear)
    setTimeout(() => div.parentNode.removeChild(div), 500)
  }, delay)
}
