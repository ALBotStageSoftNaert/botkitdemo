module.exports = function (controller) {
  const axios = require('axios');
  controller.hears(['Get_Recipe'], 'message_received', function (bot, message) {

    // let {persoon,food_type}= message.entities;
    // let food;
    // if(food_type){
    //   food= food_type[0].value;
    //   bot.reply(message,"MMM, "+food+" is lekker! Ken je dit gerecht al?")
    // }
    // else{
    //     bot.reply(message,"Ik ken veel gerechten, ik persoonlijk vind kip lekker, dit is een gerecht met kip.")
    //     food=[{value:"chicken"}];
    //   }

    //  getRecipe(food).then(response=>{


    //   if (response.data.hits) {
    //       bot.reply(message, "ik heb "+ Object.entries(response.data.hits).length +" gerechten gevonden!");

    //       let recipe=response.data.hits.map(item=>item.recipe);
    //       displayRecipe(bot,message,recipe[0]);
    //  }})
    //  .catch(error=>{
    //   bot.reply(message,"Ik probeerde een gerecht met "+ food +" voor je te zoeken, maar er liep iets mis, sorry.");
    //   console.error(error);
    //  });


    bot.createConversation(message, function (err, convo) {
      let { persoon, food_type } = message.entities;
      let food;
      convo.setVar("persoon", persoon);
      convo.setVar("food_type", food_type);
      convo.setVar("food", food);




      // create a path for when a user says YES
      convo.addMessage({
        text: 'You said yes! How wonderful.',
      }, 'yes_thread');

      // create a path for when a user says NO
      convo.addMessage({
        text: 'You said no, that is too bad.',
      }, 'no_thread');

      // create a path where neither option was matched
      // this message has an action field, which directs botkit to go back to the `default` thread after sending this message.
      convo.addMessage({
        text: 'Sorry I did not understand.',
        action: 'default',
      }, 'bad_response');

      // Create a yes/no question in the default thread...
      convo.addQuestion("Do you like cheese?", [
        {
          pattern: 'YES',
          callback: function (response, convo) {
            convo.gotoThread('yes_thread');
          },
        },
        {
          pattern: 'NO',
          callback: function (response, convo) {
            convo.gotoThread('no_thread');
          },
        },
        {
          default: true,
          callback: function (response, convo) {
            convo.gotoThread('bad_response');
          },
        }
      ], {}, 'cheese');



      //convo.addMessage("test", "gerecht");
      //default
      if (food_type) {
        food = food_type[0].value;
        //bot.reply(message,"MMM, "+food+" is lekker! Ken je dit gerecht al?")
        convo.addMessage({ text: "MMM, " + food + " is lekker! Ken je dit gerecht al?", action: "gerecht" });

      }
      else {
        //bot.reply(message,"Ik ken veel gerechten, ik persoonlijk vind kip lekker, dit is een gerecht met kip.");
        food = "chicken";
        convo.addMessage("Ik ken veel gerechten, ik persoonlijk vind kip lekker, dit is een gerecht met kip.");
      }

      //gerecht

      getRecipe(food).then(response => {
        if (response.data.hits) {
          // bot.reply(message, "ik heb "+ Object.entries(response.data.hits).length +" gerechten gevonden!");
          convo.addMessage({ text: "ik heb " + Object.entries(response.data.hits).length + " gerechten gevonden!" }, "gerecht");
          let recipe = response.data.hits.map(item => item.recipe);
          displayRecipe(convo, recipe);

          //convo.gotoThread("cheese");
          convo.activate()
        }
      })
        .catch(error => {
          convo.addMessage({ text: "Ik probeerde een gerecht met " + food + " voor je te zoeken, maar er liep iets mis, sorry.", action: "cheese" }, "gerecht");
          //convo.gotoThread("cheese");
          convo.activate();
          console.error(error);
        });


      // convo.activate();


    });




    //con.activate();

  });




  const displayRecipe = (convo, recipe) => {
    // var reply = {
    //   text: recipe.label,
    // }
    var options = [];
    
    for(var i=0;i<recipe.length;i++){
      var obj={};
      if (recipe[i].label) {
      obj.title = recipe[i].label;
      obj.payload = recipe[i].label;      
      if (recipe[i].image) {
        obj.image = recipe[i].image;
      }
      options.push(obj)
    }
    }


    //bot.reply(message,reply)
    //convo.addMessage(reply, "gerecht");
    convo.addMessage({
      // text:"t",
      // files: [
      //   {
      //     url: recipe.image,
      //     image: true
      //   }
      // ],
      text: "Welk recept wil je zien? :)",
      quick_replies: options
    }, "gerecht");

  }
  const getRecipe = async (food) => {
    try {
      var response = await axios.get('https://api.edamam.com/search?q=' + food + '&app_id=b19ff0b4&app_key=15826dad37bea8f810e53fbdf467c4fa&from=0&to=3');
      return response;
    } catch (error) {
      console.error(error);
    }
  }

}
