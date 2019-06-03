module.exports = function(controller) {

    controller.on('message_received', function(bot, message) {

        bot.reply(message, {
            text: message.config.messages.standardUnidentified,

    });

    });

  }