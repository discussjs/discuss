function isJSON(t) {
  try {
    return JSON.parse(t)
  } catch (error) {
    return t
  }
}

export default (options) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(options.method || 'POST', options.url, true)
    if (options.method === 'GET') xhr.send()
    else xhr.send(JSON.stringify(options.data))
    xhr.onreadystatechange = () => {
      try {
        if (xhr.readyState === 4) {
          const isSuccess = xhr.status >= 200 && xhr.status < 300
          if (isSuccess) resolve(isJSON(xhr.responseText))
          else reject(xhr)
        }
      } catch (error) {
        reject(error)
      }
    }
  })
}
