module.exports = function(controller) {
// // Set up connection to wit
//   var wit = require('botkit-middleware-witai')({
//     token: "WJIHNVL4HXXGQXL2CNJ73MGUXS5JD3K7"
//   });
// // Initialise the middleware for wit
// controller.middleware.receive.use(wit.receive);
  
// controller.hears(['Put_Language'], 'direct_message,direct_mention,mention', wit.hears, function(bot, message) {
//   bot.reply(message, 'Hello from wit!');
// });

  controller.hears('test','message_received', function(bot, message) {

    bot.reply(message,'I heard a test');

  });

  controller.hears('typing','message_received', function(bot, message) {

    bot.reply(message,{
      text: 'This message used the automatic typing delay',
      typing: true,
    }, function() {

      bot.reply(message,{
        text: 'This message specified a 5000ms typing delay',
        typingDelay: 5000,
      });

    });

  });

}
