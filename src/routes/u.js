export default {
  method: 'GET',
  path: '/u/{name}',
  handler(request, reply) {
    reply('Hello, ' + encodeURIComponent(request.params.name) + '! ' + JSON.stringify(request.query))
  }
}
