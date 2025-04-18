import { Client, Message } from 'discord.js';
import { CONSTANTES } from '../config/constantes';

// https://www.youtube.com/watch?v=O6S8p5rqQjc&list=PLuWyq_EO5_ALOnpxptlqQA5FR75Nza2PQ&index=13

module.exports = (bot: Client, message: Message) =>
{
    if ( message.author.bot )
		return;

	const argv: string[] = message.content.split(/ +/);
	if (argv.length < 2)
		return;
	if (argv[0].toLowerCase() !== CONSTANTES.PREFIX)
		return;

    const commandName:string = argv[1].toLowerCase();


    const command = bot.commands.get(commandName) || bot.commands.find(cmd => !!cmd.help.aliases?.includes(commandName));
    if (!command)
		return;
    

    // if (command.help.argv && argv.length < command.help.argv)
    //     return message.channel.send("Pas assez d'arguments pour cette commande");

    // if (!bot.cooldowns.has(command.help.name))
    //     bot.cooldowns.set(command.help.name, new Collection());

    // const timeNow = Date.now();
    // const tUtilisateurs = bot.cooldowns.get(command.help.name);
    // const cooldownCommand = (command.help.cooldown ) * 1000;

    // if (tUtilisateurs.has(message.author.id))
	// {
    //     const cdExpirationTime = tUtilisateurs.get(message.author.id) + cooldownCommand;
        
    //     if (timeNow < cdExpirationTime)
	// 	{
    //         timeLeft = (cdExpirationTime - timeNow) / 1000;
    //         return message.reply(` Cooldown restant pour \`${command.help.name}\` pour l'utilisateur \`${message.author.tag}\` : ${timeLeft.toFixed(0)} secondes`);
    //     }
    // }

    // tUtilisateurs.set(message.author.id, timeNow);
    
    // setTimeout(() => tUtilisateurs.delete(message.author.id), cooldownCommand);

    
    // if (command.help.prive && message.guild) return message.channel.send( `La commande \`${CONSTANTES.PREFIX}${command.help.name}\` doit être envoyée en privé`);
    // if (command.help.serveur && !message.guild) return message.channel.send( `La commande \`${CONSTANTES.PREFIX}${command.help.name}\` doit être envoyée dans un serveur`);

    // if (command.help.channelsJeu && !bot.channelsJeu.has(message.channel.guild.id) || ( command.help.channelsJeu && bot.channelsJeu.has(message.channel.guild.id) && bot.channelsJeu.get(message.channel.guild.id) &&  bot.channelsJeu.get(message.channel.guild.id).has(CONSTANTES.GAME_CHANNEL_NAME)) )
	// {
    //     const command2 = bot.commands.get("set_channel") ;
    //     command2.run(bot, message, argv);
    //     if (command.help.channelsJeu && !bot.channelsJeu.has(message.channel.guild.id))
	// 	{
    //         return message.channel.send(`Veuillez configurer les channels de Jeu avec \`${CONSTANTES.PREFIX} get_ready\` ou pour changer de channel : \`${CONSTANTES.PREFIX}set_channel\``); 
    //     }
    // } 
    // command.run(bot, message, argv);
}