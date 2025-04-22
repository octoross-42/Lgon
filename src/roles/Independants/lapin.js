const
{ CONSTANTES } = require ("../../config/constantes.js");

const
{ unJoueurCherche } = require ("./fonctions/cherche.js");


module.exports.actionLegale = ( bot, guildId, indiceJ, joueurs, actionStr) =>
{
    const indiceJA = unJoueurCherche(actionStr, joueurs);
    if (! (indiceJA === false) && !(indiceJA === indiceJ)) return true;
    joueurs[indiceJ].channel.send("Action pas légale");
    return false;
    

}

module.exports.action = (bot, guildId, indiceJ, joueurs) =>
{
    const actionStr = joueurs[indiceJ].actionStr [ joueurs[indiceJ].actionStr.length -1];
    const indiceJA = unJoueurCherche(actionStr, joueurs);

    joueurs[indiceJ].channel.createDM().then(channel =>
{
        channel.send(`Vous avez mangé les carottes de ${joueurs[indiceJA].name} !`);
    })
    joueurs[indiceJA].channel.createDM().then(channel =>
{
        channel.send(`${joueurs[indiceJ].name} vous a mangé vos carottes ! Impardonnable ! Les carottes c'est sacré, il va falloir partir à la chasse...`);
    })
    joueurs[indiceJ].aJoue = true;

} 


module.exports.help = CONSTANTES.ROLESCATEGORIES.INDEPENDANTS.LAPIN;