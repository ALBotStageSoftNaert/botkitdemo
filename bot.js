/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


# EXTEND THE BOT:

  Botkit has many features for building cool and useful bots!

  Read all about it here:

    -> http://howdy.ai/botkit

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var env = require('node-env-file');
env(__dirname + '/.env');


var Botkit = require('botkit');



//setup main message configuration
let configuration=require('./config.js')();
configuration.initialiseConfig();


var rasa = require('botkit-rasa')
({rasa_uri: process.env.rasa_uri,
model:process.env.rasa_model,
project:process.env.rasa_project});
var debug = require('debug')('botkit:main');

var bot_options = {
    replyWithTyping: true,
};

// Use a mongo database if specified, otherwise store in a JSON file local to the app.
// Mongo is automatically configured when deploying to Heroku
if (process.env.MONGO_URI) {
  // create a custom db access method
  var db = require(__dirname + '/components/database.js')({});
  bot_options.storage = db;
} else {
    bot_options.json_file_store = __dirname + '/.data/db/'; // store user data in a simple JSON format
}

// Create the Botkit controller, which controls all instances of the bot.
var controller = Botkit.socketbot(bot_options);

// Set up an Express-powered webserver to expose oauth and webhook endpoints
var webserver = require(__dirname + '/components/express_webserver.js')(controller);

// Load in some helpers that make running Botkit on Glitch.com better
require(__dirname + '/components/plugin_glitch.js')(controller);

// Load in a plugin that defines the bot's identity
require(__dirname + '/components/plugin_identity.js')(controller);



// Open the web socket server
controller.openSocketServer(controller.httpserver);


var configMiddleware=require(__dirname+'/middleware/config_middleware.js')();

//Restrict access
controller.middleware.ingest.use(configMiddleware.ingest);

//inject configuration
controller.middleware.normalize.use(configMiddleware.normalize);
controller.middleware.heard.use(configMiddleware.heard);



//Rasa
controller.middleware.receive.use(rasa.receive);
controller.changeEars(rasa.hears);





// Start the bot brain in motion!!
controller.startTicking();


var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./skills/" + file)(controller);
});


controller.middleware.heard.use(function(bot, message, next) {
    if(message.entities){
      let persoon=message.entities.find(o=>o.entity==="persoon")
      if(persoon){
      switch(persoon.value){
        case "ik":
          persoon.value="jij";
          break;
        case "jij":
          persoon.value="ik";
          break;
        case "wij":
          persoon.value="jullie";
          break;
        case "hij":
          persoon.value="hij";
          break;
        default:        
          break;
      }
    }
    }
    else{
      persoon.value="jij";
    }
      next();

  });





console.log('I AM ONLINE! COME TALK TO ME: http://localhost:' + (process.env.PORT || 3000))

function usage_tip() {
    console.log('~~~~~~~~~~');
    console.log('Botkit Starter Kit');
    console.log('Execute your bot application like this:');
    console.log('PORT=3000 node bot.js');
    console.log('~~~~~~~~~~');
}