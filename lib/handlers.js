var uuid = require('uuid'),
    Joi  = require('joi'),
    Boom = require('boom'),
    Good = require('good'),
    fs   = require('fs'),
    CardStore = require('./cardStore');

var Handlers = {};

var cardSchema = Joi.object().keys({
  name: Joi.string().min(3).max(50).required(),
  recipient_email: Joi.string().email().required(),
  sender_name: Joi.string().min(3).max(50).required(),
  sender_email: Joi.string().email().required(),
  card_image: Joi.string().regex(/.+\.(jpg|bmp|png|gif)\b/).required()
});

Handlers.newCardHandler = function(request, reply) {
  if(request.method === 'get') {
    reply.view('new', { card_images: mapImages() });
  } else {
    Joi.validate(request.payload, cardSchema, function(err, val) {
      if(err) {
        console.log(err);
        return reply(Boom.badRequest(err.details[0].message));
      }

      var card = {
        name: val.name,
        recipient_email: val.recipient_email,
        sender_name: val.sender_name,
        sender_email: val.sender_email,
        card_image: val.card_image
      };

      saveCard(card);

      console.log(CardStore.cards);

      reply.redirect('/cards');
    });
  }
}

Handlers.cardsHandler = function(request, reply) {
  reply.view('cards', { cards: CardStore.cards });
}

Handlers.deleteCardHandler = function(request, reply) {
  delete CardStore.cards[request.params.id];
  reply();
}

function saveCard(card) {
  var id = uuid.v1();

  card.id = id;
  CardStore.cards[id] = card;
}

function mapImages() {
  return fs.readdirSync('./public/images/cards');
}

module.exports = Handlers;
