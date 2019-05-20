module.exports = function (controller) {
  controller.hears(['Get_Order_Status', 'Get_Delivery', 'Get_Order_Detail'], 'message_received', function (bot, message) {
    bot.createConversation(message, function (err, convo) {
      convo.setVar("initialQuestion", message);
      convo.setVar("name", "onbekend");
      convo.setVar("order", "onbekend");




      // Authenticate
      //Family name
      convo.addQuestion("Wat is de familienaam van de persoon die het order deed?", [
        {
          default: true,
          callback: function (response, convo) {
            convo.setVar("name", response.text);
            convo.next();
            convo.addMessage("Dankje {{vars.name}}","authentication");
            convo.next();
          },
        }
      ], {}, 'authentication');
      //Order number
      convo.addQuestion("Wat is het ordernummer?", [
        {
          default: true,
          callback: function (response, convo) {
            convo.setVar("order", response.text);
            convo.addMessage("Dankje {{vars.name}}","authentication");
            //convo.next();
          },
        }
      ], {}, 'authentication');
      convo.addQuestion("Ben je zeker dat de persoon {{vars.name}} het order {{vars.order}} heeft gedaan?", [
        {
          pattern: 'Yes',
          callback: function (response, convo) {
            convo.transitionTo('answer', 'Super! Laten we je vragen beantwoorden.');
            //convo.next();
          },
        },
        {
          pattern: 'No',
          callback: function (response, convo) {
            convo.transitionTo('authentication', 'Geen probleem, we proberen het opnieuw!');
           // convo.next();
          },
        },
        {
          default: true,
          callback: function (response, convo) {
            convo.addMessage('Ik begrijp niet wat je bedoelt met wat je zei, kun je nog eens proberen?',"authentication");
           // convo.next();
            convo.repeat();
            convo.next();
          },
        }
      ], {}, 'authentication');

      convo.addMessage({ text: "Oké, je vroeg dus : '" + convo.vars.initialQuestion.text + "'", action: convo.vars.initialQuestion.intent.name }, "answer");


      convo.addMessage({ text: "Je order wordt momenteel verwerkt in het magazijn."}, "Get_Order_Status");
      convo.addMessage({ text: "Je order wordt momenteel verwerkt in het magazijn, er is nog geen leveringsdatum beschikbaar." }, "Get_Delivery");
      convo.addMessage({ text: "Je order bevatte een stoel en een kast." }, "Get_Order_Detail");

      convo.on('end', function (convo) {

        if (convo.status == 'completed' || convo.status == 'stopped') {
          bot.say("Alle info over je order werd gegeven.");
        }

      });


      //default
      convo.addMessage("Ik geef je graag informatie over je order!");
      convo.next();
      convo.transitionTo("authentication", "Hiervoor heb ik wel meer informatie over jou nodig om te weten over welk order je iets wil weten en of ik je die informatie wel mag geven.");

      convo.activate();
    });


  });






}
