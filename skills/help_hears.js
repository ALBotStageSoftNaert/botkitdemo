module.exports = function(controller) {

    controller.hears(['Get_Help'], 'message_received', function (bot, message) {

        bot.reply(message, {text: message.config.messages.standardHelp});

    });

  }