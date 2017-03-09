'use strict';

process.env.NODE_ENV = __dirname.endsWith('build') ? 'production' : 'development'

if(process.env.NODE_ENV === 'production')
  require('babel-polyfill')

import Sequelize from 'sequelize'
import Hapi from 'hapi'
import fs from 'fs'
import glob from 'glob'
import path from 'path'
import { JWT_API_KEY, SERVER_PORT, DB_KEY } from '../config.js'

const server = new Hapi.Server({
  debug: { request: ['error'] }
})

server.connection({ port: SERVER_PORT })

let hapiPlugins = [
  require('vision'),
  require('inert'),
  require('hapi-async-handler'),
  require('hapi-auth-jwt2'),
  {
    register: require('hapi-sequelize'),
    options: [
      {
        name: 'main',
        models: [
          process.env.NODE_ENV === 'production'
          ? 'build/models/**/*.js'
          : 'src/models/**/*.js'
        ],
        sequelize: new Sequelize(`mysql://root${ DB_KEY? ':' + DB_KEY : '' }@localhost/reset`, {
          logging: (text) => server.log(['database'], text)
        }),
        sync: true,
        forceSync: false
      }
    ]
  }
]

server.register(hapiPlugins, (err) => {

  // Initialize jwt athentication
  server.auth.strategy('jwt', 'jwt', 'required', {
    key: JWT_API_KEY,
    async validateFunc (decoded, request, callback) {
      const db = request.getDb('main')
      const models = db.getModels()

      const userTry = await models.User.findOne({ where: { id: decoded.id } })

      if (userTry.password === decoded.password)
        callback(null, true)
      else callback(null, false)
    },
    verifyOptions: { algorithms: ['HS256'] }
  });

  // Set up routes
  const baseDir = process.cwd()
  let globPath = process.env.NODE_ENV === 'production'
    ? 'build/routes/**/*.js'
    : 'src/routes/**/*.js'
  glob.sync(globPath, {
    root: baseDir
  }).forEach(file => {
    const route = require(path.join(baseDir, file));
    server.route(route.default || route);
  });

  // Start the server
  server.start((err) => {

    if (err) throw err;

    console.log(`Server running at: ${ server.info.uri }`);

  });

  if ( err ) throw err

});


process.on('unhandledRejection', (err) => { if (err) throw err })
process.on('uncaughtException', (err) => { if (err) throw err })
