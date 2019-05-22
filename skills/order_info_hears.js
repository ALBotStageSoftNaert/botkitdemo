module.exports = function (controller) {
  controller.hears(['Get_Order_Status', 'Get_Delivery', 'Get_Order_Detail'], 'message_received', function (bot, message) {
    bot.createConversation(message, function (err, convo) {
      convo.setVar("authResponse",{text:"Er werd geen request gedaan, demo.",thread:message.intent.name});
      convo.setVar("initialQuestion", message);
      convo.setVar("name", "onbekend");
      convo.setVar("order", "onbekend");




      // Authenticate

      //Ask for family name
      convo.addQuestion("Geef de naam op die op het order vermeld staat.", [
        {
          default: true,
          callback: function (response, convo) {
            convo.setVar("name", response.text);
            convo.next();
          },
        }
      ], {}, 'authentication');

      //Order number
      convo.addQuestion("Wat is je ordernummer?", [
        {
          default: true,
          callback: function (response, convo) {
            convo.setVar("order", response.text);
            convo.next();
          },
        }
      ], {}, 'authentication');

      convo.beforeThread("authentication_response",function(convo, next) {

        // var name = convo.extractResponse('name');
      
        // do something complex here
        // myFakeFunction(name).then(function(results) {
      
        //   convo.setVar('results',results);
      
        //   // call next to continue to the secondary thread...
        //   next();
      
        // }).catch(function(err) {
        //   convo.setVar('error', err);
        //   convo.gotoThread('error');
        //   next(err); // pass an error because we changed threads again during this transition
        // });
        let c=convo.vars.authResponse;
        c.text="debuginfo: Authenticatie werd verwerkt in beforeThread";
        convo.setVar("authResponse",c);
        next();
      
      });

      convo.addMessage({text:"Bedankt, ik ga op zoek naar je order {{vars.order}} op naam van klant '{{vars.name}}'.",action:"authentication_response"},"authentication");



      convo.addMessage({text:"{{vars.authResponse.text}}",action:convo.vars.authResponse.thread},"authentication_response");

      // convo.addQuestion("Ben je zeker dat de persoon {{vars.name}} het order {{vars.order}} heeft gedaan?", [
      //   {
      //     pattern: 'Yes',
      //     callback: function (response, convo) {
      //       convo.transitionTo(convo.vars.initialQuestion.intent.name, 'Super! Laten we je vragen beantwoorden.');
      //       convo.next();
      //     },
      //   },
      //   {
      //     pattern: 'No',
      //     callback: function (response, convo) {
      //       convo.transitionTo('authentication', 'Geen probleem, we proberen het opnieuw!');
      //       convo.next();
      //     },
      //   },
      //   {
      //     default: true,
      //     callback: function (response, convo) {


      //       convo.transitionRepeat('Ik begrijp niet wat je bedoelt met wat je zei, kun je nog eens proberen?');
      //       convo.next();

      //     },
      //   }
      // ], {}, 'authentication');

      //answers
      convo.addMessage({ text: "Je order wordt momenteel verwerkt in het magazijn.", action: "extra_question" }, "Get_Order_Status");
      convo.addMessage({ text: "Je order wordt momenteel verwerkt in het magazijn, er is nog geen leveringsdatum beschikbaar.", action: "extra_question" }, "Get_Delivery");
      convo.addMessage({ text: "Je order bevatte een stoel en een kast.", action: "extra_question" }, "Get_Order_Detail");
      convo.addMessage({ text: "Ik kan je vertellen wat er in je bestelling zit, wanneer we je bestelling leveren en in welke status je bestelling zit.", action: "extra_question" }, "Help");


      //Extra question
      convo.addQuestion("Wat wil je nog weten over je order?", [
        {
          pattern: 'Get_Order_Status',
          callback: function (response, convo) {
            convo.gotoThread('Get_Order_Status');
            convo.next();
          },
        },
        {
          pattern: 'Get_Delivery',
          callback: function (response, convo) {
            convo.gotoThread('Get_Delivery');
            convo.next();
          },
        },
        {
          pattern: 'Get_Order_Detail',
          callback: function (response, convo) {
            convo.gotoThread('Get_Order_Detail');
            convo.next();
          },
        },
        {
          pattern: 'Get_Help',
          callback: function (response, convo) {
            convo.gotoThread('Help');
            convo.next();
          },
        },
        {
          pattern: 'Quit',
          callback: function (response, convo) {
            convo.addMessage("Blij dat ik je kon helpen met dit order.")
            convo.successful();
            convo.next()
          },
        },
        {
          default: true,
          callback: function (response, convo) {
            convo.transitionRepeat('Ik begrijp niet wat je bedoelt met "' + response.text + '" , kun je nog eens proberen?');
            convo.next();

          },
        }
      ], {}, 'extra_question');

      convo.on('end', function (convo) {
        if (convo.status == 'completed' || convo.status == 'stopped') {
        }
      });


      //default
      convo.addMessage("Ik geef je graag informatie over je order!");
      convo.addMessage({ text: "Hiervoor heb ik wel meer informatie nodig.", action: "authentication" });

      convo.activate();
    });


  });






}
