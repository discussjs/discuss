import request from 'xhr-ajax'

export default async (object) => {
  object.method = object.method || 'post'
  object.headers = object.headers || {
    'Content-Type': 'application/json; charset=utf-8'
  }
  return await request(object)
}
