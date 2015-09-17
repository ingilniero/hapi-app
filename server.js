var Hapi = require('hapi'),
    uuid = require('uuid');

var server = new Hapi.Server();

var cards = {};

server.register([require('inert'), require('vision')], function(err) {
  if (err) {
    console.log('Failed to load plugin:', err);
  }
});

server.connection({ port: 4000 });

server.ext('onRequest', function(request, reply) {
  console.log('Request received: ' + request.path);
  reply.continue();
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

server.route({
  path: '/cards/{id}',
  method: 'DELETE',
  handler: deleteCardHandler
})

function newCardHandler(request, reply) {
  if(request.method === 'get') {
    reply.file('templates/new.html');
  } else {
    // Business logic need to create a new card
    var card = {
      name: request.payload.name,
      recipient_email: request.payload.recipient_email,
      sender_name: request.payload.sender_name,
      sender_email: request.payload.sender_email,
      card_image: request.payload.card_image
    };

    saveCard(card);

    console.log(cards);

    reply.redirect('/cards');
  }
}

function cardsHandler(request, reply) {
  reply.file('templates/cards.html');
}

function deleteCardHandler(request, reply) {
  delete cards[request.params.id];
}

function saveCard(card) {
  var id = uuid.v1();

  card.id = id;
  cards[id] = card;
}

server.start(function (err) {
  if (err) {
    throw err;
  }

  console.log('Server runnning at:', server.info.uri);
});
