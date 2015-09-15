var Hapi = require('hapi');

var server = new Hapi.Server();

server.connection({ port: 4000 });

server.ext('onRequest', function(request, reply) {
  console.log('Request received: ' + request.path);
  reply.continue();
});

server.register(require('inert'), function(err) {
  if (err) {
    console.log('Failed to load plugin:', err);
  }

  server.route({
    path: '/',
    method: 'GET',
    handler: {
      file: 'templates/index.html'
    }
  });

});


server.start(function (err) {
  if (err) {
    throw err;
  }

  console.log('Server runnning at:', server.info.uri);
});
