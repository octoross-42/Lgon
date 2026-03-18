const
{ CONSTANTES } = require ("../../config/constantes.js");

module.exports.envoieInfos = ( bot, guildId, indiceJ, joueurs ) =>
{
    
    joueurs[indiceJ].channel.createDM().then(channel =>
{
        channel.send(`Votre rôle en fin de partie est ${joueurs[indiceJ].roleFin}`);
    })
    joueurs[indiceJ].aJoue = true;
}

module.exports.help = CONSTANTES.ROLESCATEGORIES.VILLAGEOIS.INSOMNIAQUE;