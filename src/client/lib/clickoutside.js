/**
 * 点击目标元素区域外部触发事件
 * @param {Element} targetEle 目标元素
 * @param {Function} callback 点击目标元素外部触发回调
 * @param {Element} currentEle 当前点击的元素,默认null
 * @param {Boolean} clean 是否清理事件,默认true
 */
function Clickoutside(targetEle, callback, currentEle = null, clean = true) {
  document.onclick = function (event) {
    const isTargetEle = targetEle.contains(event.target)
    const isCurrentEle = currentEle ? currentEle.contains(event.target) : false
    if (isTargetEle || isCurrentEle) return
    callback()
    if (clean) document.onclick = null
  }
}

export default Clickoutside
