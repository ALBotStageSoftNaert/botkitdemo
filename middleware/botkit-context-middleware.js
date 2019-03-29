module.exports = function(config) {

    var middleware = {};

    middleware.capture = function(bot, message,convo, next) {
        // Add a context to the text so that ML algorithms treat your request with a context.
        if(message.context){
            message.text=message.context+message.text;
        }
        next();
    };
    return middleware;
};
