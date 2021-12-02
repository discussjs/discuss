function ShakeError(el, delay = 1000) {
  el.classList.add('shake')
  setTimeout(() => el.classList.remove('shake'), delay)
}

export { ShakeError }
