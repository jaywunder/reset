import { getCookie } from './cookie'

export default function fetchAuth(url, options) {
  options = options || {}
  options.headers = options.headers || {}
  options.headers.Authorization = 'Bearer ' + getCookie('jwt')
  options.headers['Content-Type'] = 'application/json'
  return fetch(url, options)
}
