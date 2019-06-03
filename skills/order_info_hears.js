const axios = require('axios');
const template = require('../utils/templateParameters');
const findMessages = require('../utils/findMessages');
module.exports = function (controller) {
  controller.hears(['Get_Order_Status', 'Get_Delivery', 'Get_Order_Detail'], 'message_received', function (bot, message) {

    bot.createConversation(message, function (err, convo) {
      convo.setVar("Order_Info_Messages", findMessages(message.shop_token, message.language, "conversation_orderInfo"));
      convo.setVar("question", message);
      convo.setVar("name", "onbekend");
      convo.setVar("order", "onbekend");


      // Authenticate

      //Ask for family name
      convo.addQuestion({ text: "{{vars.Order_Info_Messages.name}}", nlu: false }, [
        {
          default: true,
          callback: function (response, convo) {
            convo.setVar("name", convo.extractResponse('name'));
            convo.next();
          },
        }
      ], { key: "name" }, 'authentication');

      //Order number
      convo.addQuestion({ text: "{{vars.Order_Info_Messages.orderNr}}", nlu: false }, [
        {
          default: true,
          callback: function (response, convo) {
            convo.setVar("order", convo.extractResponse('ordernr'));
            convo.next();
          },
        }
      ], { key: "ordernr" }, 'authentication');
      convo.addMessage({ text: "{{vars.Order_Info_Messages.startSearch}}" }, "authentication");
      convo.addMessage({ action: "authentication_response" }, "authentication");
      convo.beforeThread("authentication_response", function (convo, next) {
        let config = convo.vars.question.config;

        let auth = axios.create({
          baseURL: config.url
        });
        var request = {
          method: 'get',
          url: '/AccessSalesOrder/JSON/debug',
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
          if (result.data && result.data !== "") {
            convo.setVar("orderKey", result.data);

            next();
          }
          else {
            throw (new Error("Onjuiste credenties"));
          }

        }).catch(function (err) {
          convo.setVar("orderKey", "");
          convo.setVar('error', err);
          convo.gotoThread("authentication_failed");
          next(err);
        });



      });

      convo.addMessage({ text: "{{vars.Order_Info_Messages.authenticated}}", action: message.intent.name }, "authentication_response");


      convo.addMessage({ text: "{{vars.Order_Info_Messages.notAuthenticated}}" }, "authentication_failed");
      convo.addMessage({ text: "{{vars.Order_Info_Messages.checkAgain}}", image: message.config.images.order_sample }, "authentication_failed");
      convo.addQuestion("{{vars.Order_Info_Messages.retryAuthQuestion}}", [
        {
          pattern: 'Yes',
          callback: function (response, convo) {
            convo.transitionTo('authentication', '{{vars.Order_Info_Messages.retry}}');
            convo.next();
          },
        },
        {
          pattern: 'No',
          callback: function (response, convo) {
            convo.addMessage('{{vars.Order_Info_Messages.cancel}}', "authentication_failed");
            convo.successful();
            convo.next();
          },
        },
        {
          default: true,
          callback: function (response, convo) {


            convo.transitionRepeat('{{vars.Order_Info_Messages.undefined}}');
            convo.next();

          },
        }
      ], {}, 'authentication_failed');


      //retrieve answers
      convo.beforeThread("Get_Order_Status", function (convo, next) {
        let q = convo.vars.question;
        let messages = q.config.messages;
        let status = axios.create({
          baseURL: q.config.url
        });
        var request = {
          method: 'get',
          url: '/SalesOrder/JSON/debug',
          params: {
            securityKey: q.config.securityKey,
            id: convo.vars.orderKey
          }
        }

        status(request).then(function (result) {
          if (result.data && result.data !== "") {
            let order = result.data;
            processStatus(order);

            next();
          }
          else {
            throw (new Error("Wrong response"));
          }

        }).catch(function (err) {
          convo.setVar('error', err);
          convo.setVar("message", template(messages.failed, {}));
          convo.gotoThread("Failed_Order_Question");
          next(err);
        });
      });
      function processStatus(order) {
        let q = convo.vars.question;
        let messages = findMessages(q.shop_token, q.language, "Get_Order_Status");
        switch (order.status.id) {
          case 0:
            convo.setVar("statusOrderMessage", template(messages.undefined, {}));
            break;
          case 10:
            convo.setVar("statusOrderMessage", template(messages.processing, {}));
            break;
          case 20:
            if (order.dateExpectedOnStock !== "") {
              convo.setVar("statusOrderMessage", template(messages.orderedWithDate, { dateExpectedOnStock: order.dateExpectedOnStock }));
            }
            else {
              convo.setVar("statusOrderMessage", template(messages.ordered, {}));
            }
            break;
          case 30:
            if (order.isDelivery) {
              if (order.nextDeliveryDate === "") {
                convo.setVar("statusOrderMessage", template(messages.stockedDelivery, {}));
              }
              else {
                convo.setVar("statusOrderMessage", template(messages.stockedWithDeliveryDate, { deliveryDate: order.nextDeliveryDate }));
              }
            }
            else {
              convo.setVar("statusOrderMessage", template(messages.stockedPickup, {}));
            }
            break;
          case 40:
            convo.setVar("statusOrderMessage", template(messages.delivered, {}));
            break;
          case 70:
            convo.setVar("statusOrderMessage", template(messages.retour, {}));
            break;
          case 80:
            convo.setVar("statusOrderMessage", template(messages.returned, {}));
            break;
          case 90:
            convo.setVar("statusOrderMessage", template(messages.canceled, {}));
            break;
        }
      }
      convo.beforeThread("Get_Delivery", function (convo, next) {
        let q = convo.vars.question;
        let messages = q.config.messages;
        let getOrder = axios.create({
          baseURL: q.config.url
        });
        var request = {
          method: 'get',
          url: '/SalesOrder/JSON/debug',
          params: {
            securityKey: q.config.securityKey,
            id: convo.vars.orderKey
          }
        }

        getOrder(request).then(function (result) {
          if (result.data && result.data !== "") {
            let order = result.data;
            processStatus(order);
            if (order.isDelivery) {
              //TODO: change to isFinished when api updates
              if (order.isCompleted) {
                convo.setVar("deliveryOrderMessage", template(messages.deliveryCompleted, {}));
              }
              else {
                if (order.nextDeliveryDate !== "") {
                  convo.setVar("deliveryOrderMessage", template(messages.deliveryDate, { deliveryDate: order.nextDeliveryDate }));
                }
                else {
                  convo.setVar("deliveryOrderMessage", template(messages.noDeliveryDate, { status: "{{vars.statusOrderMessage}}" }));
                }
              }
            }
            else {
              convo.setVar("deliveryOrderMessage", template(messages.noDelivery, {}));
            }
            next();
          }
          else {
            throw (new Error("Wrong response"));
          }

        }).catch(function (err) {
          convo.setVar('error', err);
          convo.setVar("message", template(messages.failed, {}));
          convo.gotoThread("Failed_Order_Question");
          next(err);
        });
      });



      //answers
      convo.addMessage({ text: "{{vars.statusOrderMessage}}", action: "extra_question" }, "Get_Order_Status");
      convo.addMessage({ text: "{{vars.deliveryOrderMessage}}", action: "extra_question" }, "Get_Delivery");
      convo.addMessage({ text: "{{vars.orderHelp}}", action: "extra_question" }, "Help");
      convo.addMessage({ text: "{{vars.message}}", action: "extra_question" }, "Failed_Order_Question");





      //Extra question
      convo.addQuestion("{{vars.Order_Info_Messages.extraQuestion}}", [
        {
          pattern: 'Get_Order_Status',
          callback: function (response, convo) {
            convo.setVar("question", response);
            convo.gotoThread('Get_Order_Status');
            convo.next();
          },
        },
        {
          pattern: 'Get_Delivery',
          callback: function (response, convo) {
            convo.setVar("question", response);
            convo.gotoThread('Get_Delivery');
            convo.next();
          },
        },        
        {
          pattern: 'Get_Help',
          callback: function (response, convo) {
            convo.setVar("question", response);
            convo.setVar("orderHelp", template(response.config.messages.orderHelp, {}));
            convo.gotoThread('Help');
            convo.next();
          },
        },
        {
          pattern: 'Get_Orders',
          callback: function (response, convo) {
            convo.setVar("question", response);
            convo.gotoThread('Get_Orders');
            convo.next();
          },
        },
        {
          pattern: 'Quit',
          callback: function (response, convo) {
            convo.addMessage("{{vars.orderQuit}}")
            convo.successful();
            convo.next()
          },
        },
        {
          default: true,
          callback: function (response, convo) {
            convo.transitionRepeat(template(convo.vars.Order_Info_Messages.retryExtraQuestion,{text:response.text}));
            convo.next();

          },
        }
      ], { key: "extra_question_response" }, 'extra_question');


      //Other order
      convo.beforeThread("Get_Orders", function (convo, next) {
        let msg = convo.vars.question;
        let noOrders = msg.config.messages.noOrders;
        let whichOrder = msg.config.messages.whichOrder;
        let orderFailed = msg.config.messages.orderFailed;



        //API request
        let orders = axios.create({
          baseURL: msg.config.url
        });
        var request = {
          method: 'get',
          url: '/MyOpenSaleOrders/JSON/debug',
          params: {
            securityKey: msg.config.securityKey,
            orderId: convo.vars.orderKey
          }
        };



        orders(request).then(function (result) {
          if (result.data && result.data !== "" && result.data.length) {
            let orders = result.data;
            convo.setVar("orders", orders);
            if (orders.length > 1) {
              convo.setVar("ordersMessage", template(whichOrder, {}));
              convo.setVar("orders", orders.map(s => { return { title: s.Number, payload: s.id } }));
              convo.gotoThread('Get_Orders_Which_Order');
              next(new Error("Change Thread"));
            }
            if (orders.length <= 1) {
              convo.setVar("ordersMessage", noOrders);
              convo.gotoThread('Get_Orders_No_Orders');
              next(new Error("Change Thread"));
            }

          }
          else {
            throw (new Error("Bad response"));
          }

        }).catch(function (err) {
          convo.setVar("orders", []);
          convo.setVar('error', err);
          convo.setVar("message", orderFailed);
          convo.gotoThread("Failed_Order_Question");
          next(err);
        });
      });


      convo.addMessage({ text: "{{vars.ordersMessage}}", action: "extra_question" }, "Get_Orders_No_Orders");
      convo.addQuestion({ text: "{{vars.ordersMessage}}", quick_replies: "{{vars.orders}}" }, [{
        default: true,
        callback: function (response, convo) {
          convo.setVar("orderKey", convo.extractResponse("chosen_order"))
          //Todo: generaliseren
          convo.transitionTo('extra_question', template(convo.vars.Order_Info_Messages.chosenOrder,{key:"{{vars.orderKey}}"}));
        }
      }
      ], { key: "chosen_order" }, "Get_Orders_Which_Order");
      convo.addMessage({ text: "{{vars.ordersMessage}}", action: "extra_question" }, "Get_Orders_Order_Info");


      convo.on('end', function (convo) {
        if (convo.status == 'completed' || convo.status == 'stopped') {
        }
      });


      //default
      convo.addMessage("{{vars.Order_Info_Messages.greeting}}");
      convo.addMessage({ text: "{{vars.Order_Info_Messages.transitionAuthentication}}", action: "authentication" });

      convo.activate();
    });


  });






}
