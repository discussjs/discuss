/**
 * 防抖函数(闭包)
 * @param callback 事件触发的操作
 * @param wait 在多少毫秒内连续触发事件，重新计数
 * @returns {Function}
 */
function debounce(wait, callback) {
  let timeout = null // 使用闭包来保存timeout
  return function () {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => callback.apply(this, arguments), wait)
  }
}

export default debounce
