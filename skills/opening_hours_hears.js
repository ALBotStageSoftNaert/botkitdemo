const axios = require('axios');
module.exports = function (controller) {

    controller.hears(['Get_Openinghours'], 'message_received', function (bot, message) {

        let failed = message.config.messages.failed;
        let unknown = message.config.messages.unknown;

        let config = message.config;

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
                bot.reply(message, { text: unknown });
            }

        }).catch(function (err) {
            bot.reply(message, { text: failed });
        });


    });

}