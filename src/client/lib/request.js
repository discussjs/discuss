export default (options) => {
  options.method = options.method || 'POST'
  const requestOptions = {
    method: options.method,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: options.method === 'GET' ? undefined : JSON.stringify(options.data)
  }
  return fetch(options.url, requestOptions).then((r) => r.json())
}
