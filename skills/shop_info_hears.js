module.exports = function (controller) {
  // controller.hears(['Get_Openinghours','Get_Location'], 'message_received', function (bot, message) {
  //   bot.createConversation(message, function (err, convo) {
  //     convo.setVar("initialQuestion", message);



  //     //answers
  //     convo.addMessage({ text: "De winkel is elke weekdag open van 8 tot 18 uur, in het weekend zijn we open van 10 tot 16 uur.", action: "extra_question" }, "Get_Openinghours");
  //     convo.addMessage({ text: "Je vindt ons terug in Izegem.", action: "extra_question" }, "Get_Location");
  //     convo.addMessage({ text: "Ik kan je vertellen wanneer de winkel open is en waar we gelegen zijn. ", action: "extra_question" }, "Help");


  //     //Extra question
  //     convo.addQuestion("Wat wil je nog weten over deze winkel?", [
  //       {
  //         pattern: 'Get_Openinghours',
  //         callback: function (response, convo) {
  //           convo.gotoThread('Get_Openinghours');
  //           convo.next();
  //         }
  //       },
  //       {
  //         pattern: 'Get_Location',
  //         callback: function (response, convo) {
  //           convo.gotoThread('Get_Location');
  //           convo.next();
  //         }
  //       },
  //       {
  //         pattern: 'Get_Help',
  //         callback: function (response, convo) {
  //           convo.gotoThread('Help');
  //           convo.next();
  //         },
  //       },
  //       {
  //         pattern: 'Quit',
  //         callback: function (response, convo) {
  //           convo.addMessage("Bedankt voor je interesse.");
  //           convo.successful();
  //           convo.next()
  //         },
  //       },
  //       {
  //         default: true,
  //         callback: function (response, convo) {
  //           convo.transitionRepeat('Ik begrijp niet wat je bedoelt met "' + response.text + '" , kun je nog eens proberen?');
  //           convo.next();

  //         },
  //       }
  //     ], {}, 'extra_question');

  //     convo.on('end', function (convo) {

  //       if (convo.status == 'completed' || convo.status == 'stopped') {
          
  //       }

  //     });


  //     //default
  //     convo.addMessage({ text: "Ik geef je graag informatie over onze winkel!", action: convo.vars.initialQuestion.intent.name });

  //     convo.activate();
  //   });


  // });






}
