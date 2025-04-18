const
{ CONSTANTES } = require ("../../config/constantes.js");

module.exports.run = (bot, message, argsMessage) =>
{
    const channelName = argsMessage[0];
    const channel = message.guild.channels.cache.find(ch => ch.name === channelName );
        channel.messages.fetch().then(function(list)
{
            channel.bulkDelete(list);
        })
}

module.exports.help = CONSTANTES.COMMANDS.BOT.CLEAR_CHANNEL;