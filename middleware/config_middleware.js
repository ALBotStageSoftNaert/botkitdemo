const findMessages = require('../utils/findMessages');
module.exports = function (config) {

    var middleware = {};

    middleware.normalize = function (bot, message, next) {
        const shopConfig = JSON.parse(process.env.shopConfig);
        const expressionsConfig = JSON.parse(process.env.expressionsConfig);
        const standardExpressions = JSON.parse(process.env.standardExpressions);
        //TODO: Transform incoming language to 'NL', 'FR',...
        //Language is fixed atm
        message.language = "NL";
        if (message.shop_token && shopConfig[message.shop_token] && expressionsConfig[message.shop_token]) {
            let sc = shopConfig[message.shop_token];
            let config = {
                shopname: sc.shopName,
                project: sc.project,
                url: sc.url,
                securityKey: sc.securityKey,
                images: sc.images,
                messages: {},
            }
            config.messages=findMessages(message.shop_token,message.language);
            message.config = config;
            next();
        }
    };
    middleware.heard = function (bot, message, next) {
        const shopConfig = JSON.parse(process.env.shopConfig);
        const expressionsConfig = JSON.parse(process.env.expressionsConfig);
        const standardExpressions = JSON.parse(process.env.standardExpressions);

        message.config.messages = findMessages(message.shop_token,message.language,message.intent.name);
        
        //inject options for message.
        message.config.options=expressionsConfig[message.shop_token][message.language].answers[message.intent.name].messageOptions;

        if(!message.config.options){
            message.config.options={};
        }

        next();
    };



    middleware.ingest = function (bot, message, res, next) {
        const shopConfig = JSON.parse(process.env.shopConfig);
        const expressionsConfig = JSON.parse(process.env.expressionsConfig);
        if (message.shop_token && shopConfig[message.shop_token] && expressionsConfig[message.shop_token]) {
            next();
        }
        else {
            res.status = "401";
            res.send(JSON.stringify({ "text": "Access denied", "channel": "socket", "user": message.user, "to": message.user, "type": "message" }));
        }



    };


    return middleware;
};
