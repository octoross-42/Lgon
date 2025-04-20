const
{ CONSTANTES } = require ("../../../config/constantes.js");

module.exports.run = (bot, message, argsMessage) =>
{
    var messageAEnvoyerInit = message.content.split(" ")[1];
    if (message.content.split(" ")[1].toLowerCase() === "gnah")
{
        var messageAEnvoyerInit = "🧡";
    }

    var messageAEnvoyer = messageAEnvoyerInit;
    for (var i = 0; i < argsMessage.length -1 ; i++)
{
        var messageAEnvoyer = `${messageAEnvoyer} ${messageAEnvoyerInit}`;
    }
    message.channel.send(messageAEnvoyer);

}

module.exports.help = CONSTANTES.COMMANDS.BOT.COEURS;