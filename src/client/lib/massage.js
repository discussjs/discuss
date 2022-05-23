export default function (options) {
  let defaultOptions = { type: 'info', time: 3e3 }
  options = Object.assign(defaultOptions, options)

  let el = document.createElement('div')
  el.className = `D-msg D-msg-${options.type} D-msg-opacity`
  el.innerHTML = options.text
  //返回提示框容器元素
  let body = document.body
  body.appendChild(el)

  // 淡入
  setTimeout(() => {
    el.classList.remove('D-msg-opacity')
  }, 500)

  setTop(document.querySelector('.D-msg:last-child'))
  destroy(el, options.time)
}

function destroy(el, time) {
  // 延迟删除
  setTimeout(() => {
    // 淡出
    el.classList.add('D-msg-opacity')
    el.style.top = 0 + 'px'
    // 等待动画结束后删除
    setTimeout(() => {
      el.parentElement.removeChild(el)
      // 删除后重新设置其它元素的top(替补删除元素的位置)
      document.querySelectorAll('.D-msg').forEach((ele) => {
        setTop(ele)
      })
    }, 200)
  }, time)
}

function setTop(el) {
  const prev = el.previousElementSibling
  if (prev.classList.value.includes('D-msg')) {
    const height = parseInt(prev.style.top) + parseInt(prev.offsetHeight)
    el.style.top = 26 + height + 'px'
  } else {
    el.style.top = 26 + 'px'
  }
}
