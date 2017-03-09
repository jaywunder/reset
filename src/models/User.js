'use strict'
import path from 'path'

export default function(sequelize, DataTypes) {
  return sequelize.define('User', {
    username: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {

      }
    },
    instanceMethods: {
      async getPermissions(TeamId) {
        const TeamUsers = sequelize.import(path.join(__dirname, 'TeamUsers.js'))
        const connection = await TeamUsers.findOne({
          where: {
            TeamId: TeamId,
            UserId: this.id
          }
        })
        return connection.getPermissions()
      }
    }
  })
}
