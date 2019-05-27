const axios = require('axios');
module.exports = function (controller) {
  controller.hears(['Get_Order_Status', 'Get_Delivery', 'Get_Order_Detail'], 'message_received', function (bot, message) {

    bot.createConversation(message, function (err, convo) {
      convo.setVar("authResponse", { text: "Er werd geen request gedaan, demo.", thread: message.intent.name });
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
      convo.addMessage({ text: "Bedankt, ik ga op zoek naar je order {{vars.order}} op naam van klant '{{vars.name}}'."}, "authentication");
      convo.addMessage({action:"authentication_response"},"authentication");
      convo.beforeThread("authentication_response", function (convo, next) {
        // var name = convo.extractResponse('name');
        let config = convo.vars.initialQuestion.config;
        let authResponse = convo.vars.authResponse;
        if (config) {
          let auth = axios.create({
            baseURL: config.url
          });
          var request = {
            method: 'get',
            url: '/AccessOrder/JSON/debug',
            params: {
              securityKey: config.securityKey,
              salesNb: convo.vars.order,
              lastname: convo.vars.name.toUpperCase(),
              branch: "",
              mailAddress: "",
              postalCode: ""
            }
          }

          auth(request).then(function (result) {
            if(result.data && result.data!==""){
            convo.setVar("orderKey",result.data);

            authResponse.text = "Ik heb je bestelling gevonden.";
            convo.setVar("authResponse", authResponse);
            next();
            }
            else{
              throw(new Error("Onjuiste credenties"));
            }

          }).catch(function (err) {
            convo.setVar("orderKey","");
            convo.setVar('error', err);
            convo.gotoThread("authentication_failed");
            authResponse.text = "Ik vond je bestelling niet, wil je nog eens controleren of je wel de juiste gegevens ingaf?";
            convo.setVar("authResponse", authResponse);
            next(err);
          });
        }
        else {
          
          authResponse.text = "debuginfo: Authenticatie werd verwerkt in beforeThread";
          convo.setVar("authResponse", authResponse);
          next();
        }


      });   

      convo.addMessage({ text: "{{vars.authResponse.text}}", action: convo.vars.authResponse.thread }, "authentication_response");


      convo.addMessage({ text: "Ik vond je bestelling niet."}, "authentication_failed");
      convo.addMessage({ text: "Kun je eens controleren of je de juiste gegevens ingaf, op deze afbeelding kan je zien waar je die informatie terugvindt.",image:message.config.images.order_sample }, "authentication_failed");
      convo.addQuestion("Wil je nog eens proberen?", [
        {
          pattern: 'Yes',
          callback: function (response, convo) {
            convo.transitionTo('authentication', 'We proberen het opnieuw!');
            convo.next();
          },
        },
        {
          pattern: 'No',
          callback: function (response, convo) {
            convo.addMessage('Geen probleem, vraag me gerust opnieuw naar informatie over je order.',"authentication_failed");
            convo.successful();
            convo.next();
          },
        },
        {
          default: true,
          callback: function (response, convo) {


            convo.transitionRepeat('Ik begrijp niet wat je bedoelt met wat je zei, kun je nog eens proberen?');
            convo.next();

          },
        }
      ], {}, 'authentication_failed');


      //retrieve answers
      convo.beforeThread("Get_Order_Status", function (convo, next) {
        next();
      });
      convo.beforeThread("Get_Delivery", function (convo, next) {
        next();
      });
      convo.beforeThread("Get_Order_Detail", function (convo, next) {
        next();
      });




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
            convo.setVar("question",response);
            convo.gotoThread('Get_Order_Status');
            convo.next();
          },
        },
        {
          pattern: 'Get_Delivery',
          callback: function (response, convo) {
            convo.setVar("question",response);
            convo.gotoThread('Get_Delivery');
            convo.next();
          },
        },
        {
          pattern: 'Get_Order_Detail',
          callback: function (response, convo) {
            convo.setVar("question",response);
            convo.gotoThread('Get_Order_Detail');
            convo.next();
          },
        },
        {
          pattern: 'Get_Help',          
          callback: function (response, convo) {
            convo.setVar("question",response);
            convo.gotoThread('Help');
            convo.next();
          },
        },
        {
          pattern: 'Get_Orders',          
          callback: function (response, convo) {
            convo.setVar("question",response);
            convo.gotoThread('Get_Orders');
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


      //Other order
      convo.beforeThread("Get_Orders", function (convo, next) {
        let noOrders=message.config.messages.noOrders;
        let whichOrder=message.config.messages.whichOrder;
        let orderInfo=message.config.messages.orderInfo;
        noOrders=noOrders?noOrders:"U heeft enkel dit openstaand order bij ons. default";
        whichOrder=whichOrder?whichOrder:"Over welk order wil u meer weten? •--orders--• default";
        orderInfo=orderInfo?orderInfo:"Wat wil u graag weten over order •--order--• default";


        //API request
        

        next();
      });




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
