module.exports = function(controller) {

    controller.hears(['Get_Openinghours'], 'message_received', function (bot, message) {
        bot.reply(message, { text: "De winkel is elke weekdag open van 8 tot 18 uur, in het weekend zijn we open van 10 tot 16 uur." });

    });

  }