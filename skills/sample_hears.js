module.exports = function(controller) {
let botLanguages=["engels","frans","duits"]
controller.hears(['Put_Language'],'message_received', function(bot, message) {

  let {persoon,Language,Option}= message.entities;
  bot.reply(message, persoon[0].value + " spreekt dus "+ Language[0].value);
});
controller.hears(['Get_Language'],'message_received', function(bot, message) {
  let {persoon,Language,Option}= message.entities;
  if(persoon[0].value=="ik"){
    if(botLanguages.includes(Language[0].value)){
      bot.reply(message,"Ja, ik spreek "+ Language[0].value);
    }
    else{
      bot.reply(message,"Sorry, ik spreek geen "+ Language[0].value);
    }
  }
  else{
    bot.reply(message,"Ik heb geen idee of "+ persoon[0].value +" "+ Language[0].value +" spreekt.");
  }
});

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
