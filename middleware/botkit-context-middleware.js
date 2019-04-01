module.exports = function(config) {

    var middleware = {};

    middleware.capture = function(bot, message,convo, next) {
        // Add a context to the text so that ML algorithms treat your request with a context.
        // message.text=convo.thread+"_"+convo.responses[0].question+"_"+message.text;


        next();
    };
    return middleware;
};
