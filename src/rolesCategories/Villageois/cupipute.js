const
{ CONSTANTES } = require ("../../config/constantes.js");
const
{ unJoueurCherche } = require ("./fonctions/cherche.js");

module.exports.actionLegale = ( bot, guildId, indiceJ, joueurs, actionStr) =>
{
    const indiceJA = unJoueurCherche(actionStr, joueurs);
    const bool = ( (!( indiceJA === false ) && !(indiceJA === indiceJ)) );
    if (! bool)
{
        joueurs[indiceJ].channel.send("Action pas légale");
        return false;
    }
    return true;

}

module.exports.action = (bot, guildId, indiceJ, joueurs) =>
{
    const actionStr = joueurs[indiceJ].actionStr [ joueurs[indiceJ].actionStr.length -1];
    const indiceJA = unJoueurCherche(actionStr, joueurs);
    const commandRole =  bot.rolesCommands.get(joueurs[indiceJA].roleAction.toLowerCase());

    if (commandRole.help.typeRole[1].length){
        joueurs[indiceJA].aJoue = true;

        joueurs[indiceJA].channel.createDM().then(channel =>
{
            channel.send("Vous avez malheureusement été visité par la pute, vous ne pourrez pas jouer cette nuit...");
        })
    }
    joueurs[indiceJ].aJoue = true;
    joueurs[indiceJ].channel.createDM().then(channel =>
{
        channel.send(`Vous avez visité ${joueurs[indiceJA].name}`);
    })

} 


module.exports.help = CONSTANTES.ROLESCATEGORIES.VILLAGEOIS.CUPIPUTE;