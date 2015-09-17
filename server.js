var Hapi = require('hapi'),
    uuid = require('uuid');

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
});

server.route({
  path: '/',
  method: 'GET',
  handler: {
    file: 'templates/index.html'
  }
});

server.route({
  path: '/assets/{path*}',
  method: 'GET',
  handler: {
    directory: {
      path: './public',
      listing: false
    }
  }
});

server.route({
  path: '/cards/new',
  method: ['GET', 'POST'],
  handler: newCardHandler
})

server.route({
  path: '/cards',
  method: 'GET',
  handler: cardsHandler
});

function newCardHandler(request, reply) {
  if(request.method === 'get') {
    reply.file('templates/new.html');
  } else {
    // Business logic need to create a new card
    reply.redirect('/cards');
  }
}

function cardsHandler(request, reply) {
  reply.file('templates/cards.html');
}

server.start(function (err) {
  if (err) {
    throw err;
  }

  console.log('Server runnning at:', server.info.uri);
});
