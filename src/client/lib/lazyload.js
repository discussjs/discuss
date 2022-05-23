// 图片懒加载
export default function () {
  const imgLazyLoad = document.querySelectorAll('img[d-src]')
  imgLazyLoad.forEach((target) => {
    const io = new IntersectionObserver((entries, Observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          const src = img.getAttribute('d-src')
          img.setAttribute('src', src)
          Observer.disconnect()
        }
      })
    })
    io.observe(target)
  })
}
