module.exports = function(controller) {

    controller.on('message_received', function(bot, message) {

        bot.reply(message, {
            text: 'Ik begrijp niet wat je wil dat ik doe. Ik kan je helpen door info te geven over de winkel maar ook met vragen over je bestelling. Verder kan ik je jammer genoeg niet helpen.',

    });

    });

  }