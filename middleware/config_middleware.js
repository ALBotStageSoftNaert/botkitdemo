module.exports = function (config) {

    var middleware = {};

    middleware.normalize = function (bot, message, next) {
        const shopConfig = JSON.parse(process.env.shopConfig);
        const expressionsConfig = JSON.parse(process.env.expressionsConfig);
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
            let ec = expressionsConfig[message.shop_token];
            config.messages = ec.utterances;

            message.config = config;
            next();
        }
    };
    middleware.heard = function (bot, message, next) {
        const shopConfig = JSON.parse(process.env.shopConfig);
        const expressionsConfig = JSON.parse(process.env.expressionsConfig);
        let ec = expressionsConfig[message.shop_token];

        next();
    };

    middleware.ingest = function (bot, message, res, next) {

        // define action
        // perhaps set an http status header


        // you can access message.raw_message here

        // call next to proceed
        const shopConfig = JSON.parse(process.env.shopConfig);
        const expressionsConfig = JSON.parse(process.env.expressionsConfig);
        if (message.shop_token && shopConfig[message.shop_token] && expressionsConfig[message.shop_token]) {
            next();
        }
        else{
            res.status="401";
            
            res.send(JSON.stringify({"text":"U heeft geen toegang.","channel":"socket","user":message.user,"to":message.user,"type":"message"}));
        }



    };


    return middleware;
};
