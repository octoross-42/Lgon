import { Client, Message, Collection, Command } from 'discord.js';
import { CONSTANTES } from '../config/constantes';

// https://www.youtube.com/watch?v=O6S8p5rqQjc&list=PLuWyq_EO5_ALOnpxptlqQA5FR75Nza2PQ&index=13

function getArgv(message: Message): string[] | null
{
	const argv: string[] = message.content.split(/ +/);
	if (argv.length < 2)
		return (null);
	if (argv[0].toLowerCase() !== CONSTANTES.PREFIX)
		return (null);
	argv.shift(); // remove PREFIX
	return (argv);
}

function getCommand(bot: Client, argv: string[]): Command | null
{
    const commandName:string = argv[0].toLowerCase();

    const command = bot.commands.get(commandName)
						|| bot.commands.find(cmd => !!cmd.help.aliases?.includes(commandName));
    if (!command)
		return (null);

    if (argv.length - 1 < command.help.nbrArgsRequired)
	{
		// send help pour la commande
		return (null);
	}
	return (command);
}

function isOnCooldown(bot: Client, command: Command, message: Message): boolean
{
 if (!bot.cooldowns.has(command.help.name))
        bot.cooldowns.set(command.help.name, new Collection());

    const timeNowMs: number = Date.now();
	
	let commandUsers: Collection<string, number>;
	if (!bot.cooldowns.has(command.help.name))
	{
		commandUsers = new Collection();
		bot.cooldowns.set(command.help.name, commandUsers);
	}
    else
		commandUsers = bot.cooldowns.get(command.help.name)!;
    
	const cooldownCommandMs: number = command.help.cooldown * 1000;

    if (commandUsers.has(message.author.id))
	{
        const endCooldownTimeMs: number = commandUsers.get(message.author.id)! + cooldownCommandMs;
        
        if (timeNowMs < endCooldownTimeMs)
		{
			const timeLeftSec: number = (endCooldownTimeMs - timeNowMs) / 1000;
            message.reply(` Cooldown restant pour \`${command.help.name}\` pour l'utilisateur \`${message.author.tag}\` : ${timeLeftSec.toFixed(0)} secondes`);
	
			return (true);
        }
    }

    commandUsers.set(message.author.id, timeNowMs);
    setTimeout(() => commandUsers.delete(message.author.id), cooldownCommandMs);

	return (false);
}

module.exports = (bot: Client, message: Message): Promise<void> | void =>
{
	if ( message.author.bot )
		return ;

	let argv: string[] | null = getArgv(message);
	if ( !argv )
		return ;

	const command: Command | null = getCommand(bot, argv);
	if ( !command )
		return ;

	if (isOnCooldown(bot, command, message))
		return ;
    
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
