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
if (!process.env.wit) {
  console.log('Error: Specify wit in environment');
  process.exit(1);
}

var Botkit = require('botkit');
var wit = require('botkit-middleware-witai')({  
  token: process.env.wit
});
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

//implement context handling
var contextmiddleware=require(__dirname+'/middleware/botkit-context-middleware.js')();
controller.middleware.capture.use(contextmiddleware.capture)

//implement wit integration
controller.middleware.receive.use(wit.receive);
controller.changeEars(wit.hears);

// Start the bot brain in motion!!
controller.startTicking();
var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./skills/" + file)(controller);
});


controller.middleware.heard.use(function(bot, message, next) {
    var entities=message.entities;

    if(entities.persoon){
      switch(entities.persoon[0].value){
        case "ik":
          entities.persoon[0].value="jij";
          break;
        case "jij":
          entities.persoon[0].value="ik";
          break;
        case "wij":
          entities.persoon[0].value="jullie";
          break;
        case "hij":
          entities.persoon[0].value="hij";
          break;
        default:        
          break;
      }
    }
    else{
      entities.persoon=[{value:"jij"}]
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