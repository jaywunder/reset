export default {
  method: 'GET',
  path: '/static/{fname*}',
  config: {
    auth: false
  },
  handler: function (request, reply) {
    return reply.file('build/front-build/static/' + request.params.fname);
  }
}
