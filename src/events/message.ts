import { Client, Message, Collection } from 'discord.js';
import { Command } from '../types/Command.js';
import { CONSTANTES } from '../config/constantes.js';

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
						|| bot.commands.find(cmd => !!cmd.aliases.includes(commandName));
    if (!command)
		return (null);

    if (argv.length - 1 < command.nbrArgsRequired)
	{
		// send help pour la commande
		return (null);
	}
	return (command);
}

function isOnCooldown(bot: Client, command: Command, message: Message): boolean
{
 if (!bot.cooldowns.has(command.name))
        bot.cooldowns.set(command.name, new Collection());

    const timeNowMs: number = Date.now();
	
	let commandUsers: Collection<string, number>;
	if (!bot.cooldowns.has(command.name))
	{
		commandUsers = new Collection();
		bot.cooldowns.set(command.name, commandUsers);
	}
    else
		commandUsers = bot.cooldowns.get(command.name)!;
    
	const cooldownCommandMs: number = command.cooldown * 1000;

    if (commandUsers.has(message.author.id))
	{
        const endCooldownTimeMs: number = commandUsers.get(message.author.id)! + cooldownCommandMs;
        
        if (timeNowMs < endCooldownTimeMs)
		{
			const timeLeftSec: number = (endCooldownTimeMs - timeNowMs) / 1000;
            message.reply(` Cooldown restant pour \`${command.name}\` pour l'utilisateur \`${message.author.tag}\` : ${timeLeftSec.toFixed(0)} secondes`);
	
			return (true);
        }
    }

    commandUsers.set(message.author.id, timeNowMs);
    setTimeout(() => commandUsers.delete(message.author.id), cooldownCommandMs);

	return (false);
}

export function onEvent(bot: Client, message: Message): void
{
	console.log(`Message received: ${message.content}`);
	if ( message.author.bot )
		return ;

	let argv: string[] | null = getArgv(message);
	if ( !argv )
		return ;

	console.log(argv);
	const command: Command | null = getCommand(bot, argv);
	if ( !command )
		return ;

	if (isOnCooldown(bot, command, message))
		return ;
    
    
    // if (command.channelsJeu && !bot.channelsJeu.has(message.channel.guild.id) || ( command.channelsJeu && bot.channelsJeu.has(message.channel.guild.id) && bot.channelsJeu.get(message.channel.guild.id) &&  bot.channelsJeu.get(message.channel.guild.id).has(CONSTANTES.GAME_CHANNEL_NAME)) )
	// {
    //     const command2 = bot.commands.get("set_channel") ;
    //     command2.run(bot, message, argv);
    //     if (command.channelsJeu && !bot.channelsJeu.has(message.channel.guild.id))
	// 	{
    //         return message.channel.send(`Veuillez configurer les channels de Jeu avec \`${CONSTANTES.PREFIX} get_ready\` ou pour changer de channel : \`${CONSTANTES.PREFIX}set_channel\``); 
    //     }
    // }
	argv.shift(); // remove command name
    command.run(bot, message, argv);
}

export const name = "message";
