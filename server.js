var Hapi = require('hapi'),
    CardStore = require('./lib/cardStore');

var server = new Hapi.Server();

CardStore.initialize();

server.register([
  { register: require('inert'), options: {} },
  { register: require('vision'), options: {} },
  { register: require('hapi-auth-cookie'), options: {} },
  {
    register: require('good'),
    options: {
      opsInterval: 500,
      reporters: [
        {
          reporter: require('good-file'),
          events: { ops: '*' },
          config: {
            path: './logs',
            prefix: 'hapi-process',
            rotate: 'daily'
          }
        },
        {
          reporter: require('good-file'),
          events: { response: '*' },
          config: {
            path: './logs',
            prefix: 'hapi-requests',
            rotate: 'daily'
          }
        },
        {
          reporter: require('good-file'),
          events: { error: '*' },
          config: {
            path: './logs',
            prefix: 'hapi-error',
            rotate: 'daily'
          }
        },
      ]
    }
  }], function(err) {
  if (err) {
    console.log('Failed to load plugin:', err);
  }
});

server.connection({ port: 4000 });

server.views({
  engines: {
    html: require('handlebars')
  },
  path: './templates'
});

server.ext('onPreResponse', function(request, reply) {
  if(request.response.isBoom) {
    return reply.view('error', request.response);
  }

  reply.continue();
});

server.route(require('./lib/routes'));

server.start(function (err) {
  if (err) {
    throw err;
  }

  console.log('Server runnning at:', server.info.uri);
});
