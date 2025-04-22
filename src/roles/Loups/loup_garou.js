const
{ CONSTANTES } = require ("../../config/constantes.js");
const
{ trouveLG } = require ("./fonctions/cherche.js");


module.exports.envoieInfos = ( bot, guildId, indiceJ, joueurs ) =>
{ //joueur de classe Joueur

    var loups = trouveLG( joueurs );

    var messageAEnvoyer = new String();

    if (loups.length === 1)
{
        messageAEnvoyer = `Vous êtes seul...😓 Vous pouvez regarder une carte au centre pour noyer votre tristesse`; 
    }

    else if (loups.length === 2)
{ // toi et une autre personne
        if (indiceJ === loups[0]){
            messageAEnvoyer = `Le loup avec toi est : ${joueurs[loups[1]].name}`;
        }
        else
{
            messageAEnvoyer = `Le loup avec toi est : ${joueurs[loups[0]].name}`;
        }

        joueurs[indiceJ].aJoue = true;
    }
    
    else
{
        joueurs[indiceJ].aJoue = true;
        messageAEnvoyer = "Les loups avec toi sont : ";
        for (var i = 0; i < loups.length -1 ; i++){
            if (! (i ===  indiceJ)){    // les loups avec toi ne sont pas toi
                if (indiceJ === loups[loups.length -1])
{ // si tu es à la fin
                    if (i === loups.length -3){
                        messageAEnvoyer = `${messageAEnvoyer}${ joueurs[loups[i]].name} et ${ joueurs[loups[i + 1]].name}`;
                        break;
                    }
                    else
{
                        messageAEnvoyer = `${messageAEnvoyer}${ joueurs[loups[i]].name}, `;
                    }
                }
                else if (indiceJ === loups[loups.length -2])
{ // si tu es à la fin mais presque
                    if (i === loups.length -3){
                        messageAEnvoyer = `${messageAEnvoyer}${ joueurs[loups[i]].name} et ${ joueurs[loups[i + 2 ]].name}`;
                        break;
                    }
                    else
{
                        messageAEnvoyer = `${messageAEnvoyer}${ joueurs[loups[i]].name}, `;
                    }

                }
                else{
                    if (i === loups.length -2){   // si t'es pas à l'arrière t'es à l'avant
                        messageAEnvoyer = `${messageAEnvoyer}${ joueurs[loups[i -2 ]].name} et ${ joueurs[loups[i -1]].name}`;
                    }
                    else
{
                        messageAEnvoyer = `${messageAEnvoyer}${ joueurs[loups[i]].name}, `;
                    }
                }
            }
        }
    }                

    joueurs[indiceJ].channel.createDM().then ( channel =>
{
        channel.send(messageAEnvoyer);

    })
}

module.exports.actionLegale = ( bot, guildId, indiceJ, joueurs, actionStr) =>
{
    const bool = ( actionStr === "gauche" || actionStr === "milieu" || actionStr === "droite");
    if  (!bool)
{
        joueurs[indiceJ].channel.send("Action pas légale");
        return false;
    } 
    return true;

}

module.exports.action = (bot, guildId, indiceJ, joueurs) =>
{
    const actionStr = joueurs[indiceJ].actionStr [joueurs[indiceJ].actionStr.length -1 ];

    const rolesCentre = bot.parties.get(guildId).get('rolesCentre');
    var messageAEnvoyer = new String ();

    if ( actionStr === "gauche" )
{
        messageAEnvoyer = `Le rôle est : ${rolesCentre[0]}`;
    }
    else if (actionStr === "milieu")
{
        messageAEnvoyer = `Le rôle est : ${rolesCentre[1]}`;
    }
    else if ( actionStr === "droite" )
{
        messageAEnvoyer = `Le rôle est : ${rolesCentre[2]}`;
    }

    joueurs[indiceJ].channel.createDM().then(channel =>
{
        channel.send(messageAEnvoyer);
    })
} 
module.exports.help = CONSTANTES.ROLESCATEGORIES.LOUPS.LOUP_GAROU;