import NOTIFICATION_TYPES from '../../../../../util/notification-constants'

export default {
  method: 'GET',
  path: '/api/v1/info/user/name',
  config: {
    plugins: {
      'hapi-io': 'info_user_name'
    }
  },
  handler: {
    async async(request, reply) {
      const db = request.getDb('main')
      const models = db.getModels()

      const requestUser = await models.User.findOne({ where: { id: request.auth.credentials.id }})
      const infoUser = await models.User.findOne({ where: { id: request.query.id }})

      // objective: check if the requestUser is on a team with the infoUser

      // two lists with TeamIds of each user
      const requestUserTeams = await models.TeamUsers.findAll({
        attributes: ['TeamId'],
        where: {
          UserId: requestUser.id
        }
      }).map(team => team.TeamId)

      const infoUserTeams = await models.TeamUsers.findAll({
        attributes: ['TeamId'],
        where: {
          UserId: infoUser.id
        }
      }).map(team => team.TeamId)

      const teamsInCommon = infoUserTeams.filter(elem => requestUserTeams.includes(elem))

      // find out if the infoUser has requested to join any of the teams
      // the requestUser is on
      const userWantsToJoinATeamInCommon = await models.Notification.findOne({ where: {
        OriginUserId: infoUser.id,
        TargetTeamId: { $or: infoUserTeams },
        type: NOTIFICATION_TYPES.JOIN_REQUEST,
      }})

      if (teamsInCommon.length > 0 || !!userWantsToJoinATeamInCommon)
        return reply({ name: infoUser.name })

      else return reply({ err: "you don't have permission to see that user's names" })
    }
  }
}
