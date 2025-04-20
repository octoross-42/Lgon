const
{ Collection } = require("discord.js");
const
{ CONSTANTES } = require ("../../../config/constantes.js");

module.exports.run = (bot, message, argsMessage) =>
{
    var channelJeu = message.guild.channels.cache.find(ch => ch.name === CONSTANTES.GAME_CHANNEL_NAME);
    var channelRoles = message.guild.channels.cache.find(ch => ch.name === ROLES_CHANNEL_NAME) ;
    var channelErreurs = message.guild.channels.cache.find(ch => ch.name === CONSTANTES.ERRORS_CHANNEL_NAME);

    var serveur = new Collection();

    var time = 1000;

    if (channelJeu === undefined)
{
        channelJeu = message.guild.channels.create(`${CONSTANTES.GAME_CHANNEL_NAME}`,
{ type: "text",
                                                                        });
        setTimeout ( function ()
		{
            channelJeu = message.guild.channels.cache.find(ch => ch.name === CONSTANTES.GAME_CHANNEL_NAME);
            serveur.set (CONSTANTES.GAME_CHANNEL_NAME, channelJeu);
            bot.channelsJeu.set(message.guild.id, serveur);
            time += time;
        }, time);                                                                   
    }
    else
{
        serveur.set(CONSTANTES.GAME_CHANNEL_NAME, channelJeu);
        bot.channelsJeu.set(message.guild.id, serveur);
    }
            
    if (channelRoles === undefined)
{
        channelRoles = message.guild.channels.create(`${ROLES_CHANNEL_NAME}`,
{ type: "text",
                                                                        });
        setTimeout ( function ()
{
            channelRoles = message.guild.channels.cache.find(ch => ch.name === ROLES_CHANNEL_NAME) ;
            serveur.set(ROLES_CHANNEL_NAME, channelRoles);
            bot.channelsJeu.set(message.guild.id, serveur);

            var messagesRolesArray = new Array();

            for (var i = 0; i < ROLES_DATA.length; i++)
{
                
                channelRoles.send(ROLES_DATA[i]).then(sentMessage =>
{
                    sentMessage.react("0️⃣");
                    sentMessage.react("1️⃣");
                    sentMessage.react("2️⃣");
                    sentMessage.react("3️⃣");
                    sentMessage.react("4️⃣");
                    sentMessage.react("5️⃣");
                    //sentMessage.react("6️⃣");
                    //sentMessage.react("7️⃣");
                    //sentMessage.react("8️⃣");
                    //sentMessage.react("9️⃣");
                    messagesRolesArray.push(sentMessage);
                })
            }
            bot.messagesRoles.set(message.guild.id, messagesRolesArray);

            time += time;
        }, time);
    }
    else
{
        serveur.set(ROLES_CHANNEL_NAME, channelRoles);
        bot.channelsJeu.set(message.guild.id, serveur);

        var messagesRolesArray = new Array();

        for (var i = 0; i < ROLES_DATA.length; i++)
{
            
            channelRoles.send(ROLES_DATA[i]).then(sentMessage =>
{
                sentMessage.react("0️⃣");
                sentMessage.react("1️⃣");
                sentMessage.react("2️⃣");
                sentMessage.react("3️⃣");
                sentMessage.react("4️⃣");
                sentMessage.react("5️⃣");
                //sentMessage.react("6️⃣");
                //sentMessage.react("7️⃣");
                //sentMessage.react("8️⃣");
                //sentMessage.react("9️⃣");
                messagesRolesArray.push(sentMessage);
            })
        }
        bot.messagesRoles.set(message.guild.id, messagesRolesArray);
    }

            
    if (channelErreurs === undefined)
{
        channelErreurs = message.guild.channels.create(`${CONSTANTES.ERRORS_CHANNEL_NAME}`,
{ type: "text",
                                                                        //https://discord.js.org/?source=post_page---------------------------#/docs/main/stable/class/PermissionOverwrites?scrollTo=id
                                                                                });
        setTimeout ( function ()
{
            channelErreurs = message.guild.channels.cache.find(ch => ch.name === CONSTANTES.ERRORS_CHANNEL_NAME);
            serveur.set(CONSTANTES.ERRORS_CHANNEL_NAME, channelErreurs);
            bot.channelsJeu.set(message.guild.id, serveur);
        }, time);               
    }
    else
{
        serveur.set(CONSTANTES.ERRORS_CHANNEL_NAME, channelErreurs);
        bot.channelsJeu.set(message.guild.id, serveur);
    }
};

module.exports.help = CONSTANTES.COMMANDS.BOT.GET_READY;