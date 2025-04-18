const
{ CONSTANTES } = require ("../../config/constantes.js");

module.exports.actionLegale = ( bot, guildId, indiceJ, joueurs, actionStr) =>
{
    const bool = ( actionStr.toLowerCase() === "gauche" || actionStr.toLowerCase() === "milieu" || actionStr.toLowerCase() === "droite");
    if (bool) return true;
    joueurs[indiceJ].channel.send("Action pas légale");
    return false;

}

module.exports.action = (bot, guildId, indiceJ, joueurs) =>
{
    const actionStr = joueurs[indiceJ].actionStr [ joueurs[indiceJ].actionStr.length -1];
    var rolesCentre = bot.parties.get(guildId).get("rolesCentre");
    var indiceC = false;
    if (actionStr.toLowerCase() === 'gauche')
{
        indiceC = 0;
    }
    else if (actionStr.toLowerCase() === 'milieu')
{
        indiceC = 1;
    }
    else
{
        indiceC = 2;
    }

    const rolePassage = joueurs[indiceJ].roleFin;
    joueurs[indiceJ].roleFin = rolesCentre [indiceC];
    rolesCentre [indiceC] = rolePassage;
    joueurs[indiceJ].aJoue = true;

} 


module.exports.help = CONSTANTES.ROLESCATEGORIES.VILLAGEOIS.SOULARD;