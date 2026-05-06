const
{ CONSTANTES } = require ("../../config/constantes.js");
const
{ unJoueurCherche } = require ("./fonctions/cherche.js");


module.exports.actionLegale = ( bot, guildId, indiceJ, joueurs, actionStr) =>
{
    const indiceJA = unJoueurCherche(actionStr, joueurs);
    if (! (indiceJA === false) && !(indiceJA === indiceJ))
{
        return true;
    }
    joueurs[indiceJ].channel.send("Action pas légale");
    
    return false;

}

module.exports.action = (bot, guildId, indiceJ, joueurs) =>
{
    joueurs[indiceJ].aJoue = true;

} 

module.exports.help = CONSTANTES.ROLESCATEGORIES.INDEPENDANTS.ASSASSIN;