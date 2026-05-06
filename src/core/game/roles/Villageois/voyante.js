const
{ CONSTANTES } = require ("../../config/constantes.js");
const
{ unJoueurCherche } = require ("./fonctions/cherche.js");

module.exports.envoieInfos = ( bot, guildId, indiceJ, joueurs ) =>
{
}

module.exports.actionLegale = ( bot, guildId, indiceJ, joueurs, actionStr) =>
{
    const centre1 = actionStr.split(" ")[0].toLowerCase();
    const centre2 = actionStr.split(" ")[1].toLowerCase();
    const boolC =  (centre1 === "gauche" || centre1 === "milieu" || centre1 === "droite") && (centre2 === "gauche" || centre2 === "milieu" || centre2 === "droite") && !(centre1 === centre2);
    const indiceJA = unJoueurCherche(actionStr, joueurs);
    if (boolC || !(indiceJA === false) ) return true;
    joueurs[indiceJ].channel.send("Action pas légale");
    return false;
    
    

}

module.exports.action = (bot, guildId, indiceJ, joueurs) =>
{
    const indiceJA = unJoueurCherche(actionStr, joueurs);
    joueurs[indiceJ].aJoue = true;
    if (! (indiceJA === false))
{
        joueurs[indiceJ].channel.createDM().then(channel =>
{
            channel.send(`${joueurs[indiceJA].name} est ${joueurs[indiceJA].roleFin}`);
        });
    }
    else
{
        const rolesCentre = bot.rolesCommands.get(guildId).get ("rolesCentre");
        const centre1 = actionStr.split(" ")[0].toLowerCase();
        const centre2 = actionStr.split(" ")[1].toLowerCase();

        if (centre1 === 'gauche')
{
            indiceC1 = 0;
        }
        else if (centre1 === 'milieu')
{
            indiceC1 = 1;
        }
        else
{
            indiceC1 = 2;
        }
        if (centre2 === 'gauche')
{
            indiceC2 = 0;
        }
        else if (centre2 === 'milieu')
{
            indiceC2 = 1;
        }
        else
{
            indiceC2 = 2;
        }
        
        joueurs[indiceJ].channel.createDM().then(channel =>
{
            channel.send(`Les centres sont respectivement ${rolesCentre[indiceC1]} et ${rolesCentre[indiceC2]}`);
        })

    }

} 


module.exports.help = CONSTANTES.ROLESCATEGORIES.VILLAGEOIS.VOYANTE;