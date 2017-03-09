export default {
  method: 'GET',
  path: '/api/v1/user',
  config: {
    auth: 'jwt',
    plugins: {
      'hapi-io': 'user_data'
    }
  },
  handler: {
    async async (request, reply) {
      const db = request.getDb('main')
      const models = db.getModels()
      let userInfo = {}
      const user = await models.User.findOne({
        attributes: ['username', 'id', 'name'],
        where: {
          id: request.auth.credentials.id
        }
      })

      userInfo = Object.assign(userInfo, user.dataValues)

      // const teamConnections = await models.TeamUsers.findAll({
      //   attributes: ['position', 'nickname', 'TeamId', 'PermissionsId'],
      //   where: {
      //     UserId: user.id
      //   }
      // })
      // let teams = teamConnections.map(async connection => {
      //   let team = await models.Team.findOne({
      //     attributes: [ 'teamname', 'public', 'id' ],
      //     where: { id: connection.TeamId }
      //   })
      //
      //   team = Object.assign(team.dataValues, connection.dataValues)
      //   delete team.TeamId
      //
      //   team.permissions = await connection.getPermissions({
      //     attributes: { exclude: ['createdAt', 'TeamUserTeamId', 'updatedAt']}
      //   })
      //
      //   return team
      // })
      // userInfo.teams = await Promise.all(teams)

      return reply(userInfo)
    }
  }
}
