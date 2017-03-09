import { JWT_API_KEY } from '../../config.js'
import jwt from 'jsonwebtoken'

export function createToken(obj) {
  return jwt.sign(obj, JWT_API_KEY, { algorithm: 'HS256', expiresIn: "99999999999h" })
}

export function decodeToken(token) {
  return jwt.verify(token, JWT_API_KEY)
}
