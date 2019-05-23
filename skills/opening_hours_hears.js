const axios = require('axios');
module.exports = function (controller) {

    controller.hears(['Get_Openinghours'], 'message_received', function (bot, message) {


        let config = message.config;
        if (config) {
            let hours = axios.create({
                baseURL: config.url
            });
            var request = {
                method: 'get',
                url: '/OpeningHours/JSON/debug',
                params: {
                    securityKey: config.securityKey,
                }
            }

            hours(request).then(function (result) {
                if (result.data && result.data !== "") {
                    bot.reply(message, { text: result.data });
                }
                else {
                    bot.reply(message, { text: "Ik ken de openingsuren van deze winkel niet." });
                }

            }).catch(function (err) {
                bot.reply(message, { text: "Ik kon de openingsuren niet ophalen..." });
            });
        }
        else {
            bot.reply(message, { text: "Ik kon de openingsuren niet ophalen..." });
        }
    });

}