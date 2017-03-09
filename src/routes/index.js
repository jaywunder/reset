export default {
  method: 'GET',
  path: '/',
  config: {
    auth: false
  },
  handler: function (request, reply) {
    return reply.file('build/front-build/index.html');
  }
}
