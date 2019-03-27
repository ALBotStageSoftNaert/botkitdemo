module.exports = function(controller) {
    const axios=require('axios');
    controller.hears(['Get_Recipe'],'message_received', function(bot, message) {
    
      let {persoon,food_type}= message.entities;
      let food;
      if(food_type){
        food= food_type[0].value;
        bot.reply(message,"MMM, "+food+" is lekker! Ken je dit gerecht al?")
      }
      else{
          bot.reply(message,"Ik ken veel gerechten, ik persoonlijk vind kip nog lekker, dit is een gerecht met kip.")
          food=[{value:"chicken"}];
        }
    
       getRecipe(food).then(response => {
        if (response.data.hits) {
            bot.reply(message, "ik heb "+ Object.entries(response.data.hits).length +" gerechten gevonden!");
            
            let recipe=response.data.hits.map(item=>item.recipe);
            displayRecipe(bot,message,recipe[0]);
       }})
       .catch(error => {
        bot.reply(message,"Ik probeerde een gerecht met "+ food +" voor je te zoeken, maar er liep iets mis, sorry.");
        console.log(error)
      })

      
    });

    const displayRecipe= (bot,message,recipe)=>{
        bot.reply(message,recipe.label)

    }
    const getRecipe = async(food) => {
        try{
            return await axios.get('https://api.edamam.com/search?q='+ food +'&app_id=b19ff0b4&app_key=15826dad37bea8f810e53fbdf467c4fa');
        }catch(error){
            console.error(error);
        }
    }
       
}
    