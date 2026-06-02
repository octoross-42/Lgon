const
{ CONSTANTES } = require ("../../config/constantes.js");

module.exports.envoieInfos = ( bot, guildId, indiceJ, joueurs ) =>
{
	var messageAEnvoyer = new String();
	var indiceFM = false;
	for (var i = 0; i < joueurs.length; i ++ ){
		if (joueurs[i].roleFin.toLowerCase() === "franc-maçon" && !(i === indiceJ)){
			indiceFM = i;
			break;
		}
	}
	if (indiceFM === false){
		messageAEnvoyer = `Vous êtes seul 😓`;
	}
	else
{
		messageAEnvoyer = `Vous êtes avec ${joueurs[indiceFM].name} !`;
	}
	joueurs[indiceJ].aJoue = true;
	joueurs[indiceJ].channel.createDM().then(channel =>
{
		channel.send(messageAEnvoyer);
	})
}



module.exports.help = CONSTANTES.ROLESCATEGORIES.VILLAGEOIS.FRANC_MACON;