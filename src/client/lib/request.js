/**
 *
 * 封装ajax请求
 * @param {*} obj 请求参数
 * @returns {Promise}
 */

function ajax(obj) {
  return new Promise((resolve, reject) => {
    //设置是否异步，默认为true
    obj.async = obj.async || true
    //设置数据的默认值
    obj.data = obj.data || null
    var xhr
    if (window.XMLHttpRequest) xhr = new XMLHttpRequest()
    //非ie
    else xhr = new ActiveXObject('Microsoft.XMLHTTP') //ie

    xhr.open('post', obj.url, obj.async)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send(JSON.stringify(obj.data))

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) resolve(JSON.parse(xhr.responseText))
        else {
          // 由于 async/await 不能捕获 reject 所以使用 resolve
          // 如果执意要用 reject 那么就得用try/catch来捕获 reject
          resolve({ status: xhr.status, msg: '请求错误' })
        }
      }
    }
  })
}

export default ajax
