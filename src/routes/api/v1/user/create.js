import bcrypt from 'bcrypt'
import { createToken } from '../../../../util/token.js'
import uuid from 'uuid/v4'

function hashPassword(password, cb) {
  return new Promise((resolve, reject) => {

    bcrypt.genSalt(10, (err, salt) => {
      if (err) reject(err)

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) reject(err)

        return resolve(hash)
      })
    })
  })
}

export default {
  method: 'POST',
  path: '/api/v1/user/create',
  config: {
    auth: false
  },
  handler: {
    async async(request, reply) {
      const db = request.getDb('main')
      const User = db.getModel('User')
      const AuthCookie = db.getModel('AuthCookie')
      
      let user = await User.findOne({
        where: {
          username: request.payload.username
        }
      })

      if (user) return reply({err: 'username taken'})

      const newUser = await User.create({
        username: request.payload.username,
        name: request.payload.name,
        password: await hashPassword(request.payload.password)
      })

      const authCookie = uuid()
      const cookie = await AuthCookie.create({
        cid: authCookie
      })
      newUser.addAuthCookie(cookie)
      cookie.setUser(newUser)

      reply({
        jwt: createToken(newUser.dataValues),
        cid: authCookie
      })
    }
  }
}
