let scriptUrl
if (document.currentScript) scriptUrl = document.currentScript.src
if (!scriptUrl) {
  const scripts = document.getElementsByTagName('script')
  if (scripts.length) scriptUrl = scripts[scripts.length - 1].src
}
if (!scriptUrl) throw new Error('Automatic publicPath is not supported in this browser')
scriptUrl = scriptUrl
  .replace(/#.*$/, '') // 去除锚点
  .replace(/\?.*$/, '') // 去除参数
  .replace(/\/[^/]+$/, '/') // 去除文件名

window.DChunk = []
const map = { emot: 'emot.js', admin: 'discuss.admin.js' }
const loadScript = (chunk, callback) => {
  if (window.DChunk.includes(chunk)) return callback()
  window.DChunk.push(chunk)
  const script = document.createElement('script')
  script.src = scriptUrl + map[chunk]
  script.onload = () => {
    script.onload = null
    callback()
    script.parentNode && script.parentNode.removeChild(script)
  }
  document.head.appendChild(script)
}

export default loadScript
