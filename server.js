var Hapi = require('hapi');

var server = new Hapi.Server();

server.connection({ port: 4000 });

server.route({
  path: '/hello',
  method: 'GET',
  handler: function(request, reply) {
    reply('Hello World');
  }
});

server.start(function() {
  console.log('Server runnning at:', server.info.uri);
});
