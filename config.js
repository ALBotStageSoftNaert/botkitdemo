module.exports = function () {
 //Variables need to be placed between •-- and --• (• = alt+7)
    let config = {};
    let shopConfig = {
        'SN-Test-98510': { project: "demo-eMeubel", shopName: "Soft-Naert ontwikkelomgeving", url: "https://update.softnaert.be/WebAppAPI/emeuservice.wso", securityKey: "9Vk7kEubWEwLAfGSWebAPI", images: { order_sample: "https://update.softnaert.be/WebAppAPI/Images/Order_Sample.png" } }
    }

    let expressionsConfig = {
        'SN-Test-98510': {
            answers: {
                //tijdelijk om quickreplies snel te testen.
                Get_Recipe: {
                    handle: true,
                    //messageflags for Get_Recipe
                    messageflags: {},
                    messages: {

                    }

                },
                Put_Greeting: {
                    handle: true,
                    //messageflags for Put_Greeting
                    messageflags: {},
                    messages: {

                    }

                },
                Get_Openinghours: {
                    handle: true,
                    //messageflags for Get_Openinghours
                    messageflags: {},
                    messages: {
                        failed:"Het lukt ons niet altijd om openingsuren te geven. sorry",
                        unknown:"ik weet eigenlijk zelf niet wanneer we open zijn, bel anders eens naar de winkel?",
                    }
                },
                Get_Orders: {
                    handle: true,
                    //messageflags for Get_Orders
                    messageflags: {},
                    messages: {
                        noOrders:"U heeft enkel dit openstaand order bij ons.",
                        whichOrder:"Over welk order wil u meer weten? •--orders--•",
                        orderInfo:"Wat wil u graag weten over order •--order--•",
                    }
                },
                Get_Order_Status: {
                    handle: true,
                    //messageflags for Get_order_Status                
                },
                Yes: {
                    handle: true,
                    //messageflags for Yes
                },
                No: {
                    handle: true,
                    //messageflags for No                
                },
                Get_Help: {
                    handle: true,
                    //messageflags for Get_Help                
                },
                Get_Delivery: {
                    handle: true,
                    //messageflags for Get_Delivery                
                },
                Get_Order_Detail: {
                    handle: false,
                    //messageflags for Get_Order_Detail                
                },
                Quit: {
                    handle: true,
                    //messageflags for  Quit               
                },
                Get_Location: {
                    handle: false,
                    //messageflags for Get_Location                
                },
            },
            utterances: {
                greeting: "Welkom bij Soft-Naert ontwikkelomgeving, ik beantwoord graag je vragen.",
            }
        }
    }
    config.expressionsConfig = JSON.stringify(expressionsConfig);
    config.shopConfig = JSON.stringify(shopConfig);
    config.initialiseConfig = function () {
        process.env.expressionsConfig = config.expressionsConfig;
        process.env.shopConfig = config.shopConfig;
    }

    return config;
};
