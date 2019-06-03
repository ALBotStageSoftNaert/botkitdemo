module.exports = function () {
    //Variables need to be placed between •-- and --• (• = alt+7)
    let config = {};
    let shopConfig = {
        'SN-Test-98510': { project: "demo-eMeubel", shopName: "Soft-Naert ontwikkelomgeving", url: "https://update.softnaert.be/WebAppAPI/emeuservice.wso", securityKey: "9Vk7kEubWEwLAfGSWebAPI", images: { order_sample: "https://update.softnaert.be/WebAppAPI/Images/Order_Sample.png" } }
    }

    let expressionsConfig = {
        'SN-Test-98510': {
            NL: {
                answers: {
                    conversation_orderInfo:{},
                    Put_Greeting: {
                        handle: true,
                        //messageflags for Put_Greeting
                        messageflags: {

                        },
                        messages: {

                        }

                    },
                    Get_Openinghours: {
                        handle: true,
                        //messageflags for Get_Openinghours
                        messageflags: {},
                        messages: {
                            failed: "Het lukt ons niet altijd om openingsuren te geven. sorry",
                            unknown: "ik weet eigenlijk zelf niet wanneer we open zijn, bel anders eens naar de winkel?",
                        }
                    },
                    Get_Orders: {
                        handle: true,
                        //messageflags for Get_Orders
                        messageflags: {},
                        messages: {
                            noOrders: "U heeft enkel dit openstaand order bij ons.",
                            whichOrder: "Welk order wilt u inzien?",
                            orderInfo: "U heeft enkel nog het order •--order--•",
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
    }

    let standardExpressions = {
        NL: {
            answers: {
                conversation_orderInfo:{
                    authenticated:"Ik heb uw bestelling gevonden.",
                    notAuthenticated:"Ik vond uw bestelling niet.",
                    checkAgain:"Kan u nog eens controleren of u de juiste gegevens ingaf? Op onderstaande afbeelding kan u zien waar u die informatie terugvindt.",
                    retryAuthQuestion:"Wenst u opnieuw te proberen?",
                    retry:"We proberen het opnieuw!",
                    cancel:"Geen probleem, vraag me gerust opnieuw naar informatie over je order.",
                    undefined:"Ik begrijp niet wat je bedoelt met wat je zei, kun je nog eens proberen?",
                    startSearch:"Bedankt, ik ga op zoek naar het order {{vars.order}} op naam van klant '{{vars.name}}'.",
                    orderNr:"Wat is uw ordernummer?",
                    name:"Geef de naam op die op uw order vermeld staat.",
                    retryExtraQuestion:"Ik begrijp niet wat u bedoelt met '•--text--•' , kunt u nog eens proberen?",
                    extraQuestion:"Wat wenst u nog te weten over uw order?",
                    chosenOrder:"U koos het order •--key--•",
                    greeting:"Ik geef u graag informatie over uw order!",
                    transitionAuthentication:"Hiervoor heb ik wel meer informatie nodig.",

                },
                Put_Greeting: {

                },
                Get_Openinghours: {
                    failed: "Oeps er ging iets verkeerd. Ik kan momenteel de openingsuren niet geven, probeer het later opnieuw.",
                    unknown: "De openingsuren kan u terugvinden op onze website.",
                },
                Get_Orders: {
                    noOrders: "U heeft enkel dit openstaand order bij ons.",
                    whichOrder: "Over welk order wil u meer weten?",
                    orderFailed: "Er liep iets mis terwijl we uw orders zochten.",

                },
                Get_Order_Status: {
                    undefined: "De status van uw order is nog niet gekend.",
                    processing: "Uw order werd in behandeling genomen.",
                    ordered: "Uw order werd bij onze leveranciers besteld. We hebben nog geen bevestigde leveringsdatum ontvangen.",
                    orderedWithDate: "Uw order werd bij onze leveranciers besteld. De goederen worden bij ons verwacht rond •--dateExpectedOnStock--•.",
                    stockedDelivery: "Uw order is momenteel bij ons in voorraad. Neem gerust contact met ons op om een leveringsdatum te bespreken.",
                    stockedPickup: "Uw order is momenteel bij ons in voorraad. U wordt verwittigd wanneer u uw order kan komen afhalen.",
                    stockedWithDeliveryDate:"Uw order is volledig bij ons in voorraad, we komen bij u langs op •--deliveryDate--•.",
                    delivered: "We hebben uw order reeds afgeleverd.",
                    retour: "Uw order wordt retour genomen.",
                    returned: "Uw order werd geretourneerd.",
                    canceled: "Uw order werd geannuleerd.",
                    failed: "Het ophalen van de status van uw order is niet gelukt, probeer het later opnieuw.",
                },
                Yes: {

                },
                No: {

                },
                Get_Help: {
                    standardHelp: 'Ik kan je helpen door info te geven over de winkel maar ook met vragen over je bestelling. Verder kan ik je jammer genoeg niet helpen.',
                    orderHelp: "Ik kan je vertellen wat er in je bestelling zit, wanneer we je bestelling leveren en in welke status je bestelling zit.",

                },
                Get_Delivery: {
                    noDeliveryDate: "•--status--• Er is nog geen leveringsdatum beschikbaar.",
                    deliveryDate: "Uw order wordt geleverd op •--deliveryDate--•.",
                    noDelivery: "Uw order wordt niet geleverd.",
                    deliveryCompleted:"Uw order werd al geleverd",
                },
                Get_Order_Detail: {

                },
                Quit: {
                    orderQuit:"Blij dat ik u kon helpen met dit order."
                },
            },
            utterances: {
                greeting: "Welkom, ik beantwoord graag al uw vragen.",
                
            }
        }
    }
    config.expressionsConfig = JSON.stringify(expressionsConfig);
    config.shopConfig = JSON.stringify(shopConfig);
    config.standardExpressions = JSON.stringify(standardExpressions);
    config.initialiseConfig = function () {
        process.env.expressionsConfig = config.expressionsConfig;
        process.env.shopConfig = config.shopConfig;
        process.env.standardExpressions = config.standardExpressions;
    }

    return config;
};
