import { createToken, decodeToken } from '../../../../util/token.js'
import uuid from 'uuid/v4'
import bcrypt from 'bcrypt'

export default {
  method: 'POST',
  path: '/api/v1/user/authenticate',
  config: {
    auth: {
      mode: 'try'
    }
  },
  handler: {
    async async(request, reply) {
      const db = request.getDb('main')
      const User = db.getModel('User')

      // declare user in this scope because we'll use it later in this scope
      let user

      // Authenticate with a username and password
      if (request.payload) {

        user = await User.findOne({
          where: {
            username: request.payload.username
          }
        })

        if (!user) return reply({err: 'Bad Password or Username'})

        if (!await bcrypt.compare(request.payload.password, user.password)) {
          return reply({err: 'Bad Password or Username'})
        }

      // Authenticate with a valid JWT
      } else if (request.auth.credentials) {

        const credentials = request.auth.credentials

        user = await User.findOne({
          where: {
            username: credentials.username
          }
        })

        if (!user) return reply({err: 'Bad Password or Username'})

        if (credentials.password !== user.password) {
          return reply({err: 'Bad Password or Username'})
        }

      } else return reply({err: 'no credentials'})

      return reply({
        jwt: createToken(user.dataValues),
      })
    }
  }
}
