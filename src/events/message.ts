import { Client, Message, Collection } from 'discord.js';
import { BotCommand } from '../classes/Commands/BotCommand.js';
import { LgonRoleGenerator } from '../classes/LgonRole/LgonRoleGenerator.js';
import { getRole } from "../roles/helpers.js"
import { CONSTANTES } from '../config/constantes.js';
import { basic_help, help_role } from "../commands/bot/data/help.js";

function getArgv(message: Message): string[] | null
{
	// console.log(`Message: ${message.content}`, message.content.split(/\s+/));
	const argv: string[] = message.content.split(/\s+/);
	if (argv.length < 2)
		return (null);
	if (argv[0].toLowerCase() !== CONSTANTES.PREFIX)
		return (null);
	argv.shift(); // remove PREFIX
	argv[0] = argv[0].toLowerCase();
	return (argv);
}

function getCommand(bot: Client, argv: string[]): BotCommand | null
{
    const commandName:string = argv[0];

    const command = bot.commands.get(commandName)
						|| bot.commands.find(cmd => cmd.aliases?.includes(commandName));
    if (!command)
		return (null);

    if (argv.length - 1 < command.nbrArgsRequired)
	{
		// TODO send help pour la commande
		return (null);
	}
	return (command);
}

function fitsPlace(bot: Client, command: BotCommand, message: Message): boolean
{

	// TODO creer des fils pour mieux organiser la partie
	// console.log(message, message.channel);
	if (command.where === "any")
		return (true);
	if (command.where === "dm")
	{
		if ( message.guild )
			return (false);
		return (true);
	}
	else if ( message.guild )
		return (true);
	return (false);
}

async function isOnCooldown(bot: Client, command: BotCommand, message: Message): Promise<boolean>
{
 if (!bot.cooldowns.has(command.name))
        bot.cooldowns.set(command.name, new Collection());

    const timeNowMs: number = Date.now();
	
	let commandCdUsers: Collection<string, number>;
	if (!bot.cooldowns.has(command.name))
	{
		commandCdUsers = new Collection();
		bot.cooldowns.set(command.name, commandCdUsers);
	}
    else
		commandCdUsers = bot.cooldowns.get(command.name)!;
    
	const cooldownCommandMs: number = command.cooldown * 1000;

    if (commandCdUsers.has(message.author.id))
	{
        const endDownCooldownTimeMs: number = commandCdUsers.get(message.author.id)! + cooldownCommandMs;
        
        if (timeNowMs < endDownCooldownTimeMs)
		{
			const timeLeftSec: number = (endDownCooldownTimeMs - timeNowMs) / 1000;
            await message.reply({
				content:` Cooldown restant pour \`${command.name}\` pour l'utilisateur \`${message.author.tag}\` : ${timeLeftSec.toFixed(0)} secondes`,
				flags: CONSTANTES.FLAGS,
		});
	
			return (true);
        }
    }

    commandCdUsers.set(message.author.id, timeNowMs);
    setTimeout(() => commandCdUsers.delete(message.author.id), cooldownCommandMs);

	return (false);
}

export async function onEvent(bot: Client, message: Message): Promise<void>
{
	if ( message.author.bot )
		return ;

	let argv: string[] | null = getArgv(message);
	if ( !argv )
		return ;

	// console.log(argv);
	const command: BotCommand | null = getCommand(bot, argv);
	if ( !command )
	{
		const role: LgonRoleGenerator | null = getRole(bot, argv[0]);
		if ( !role )
			return ;

		help_role(message, role);
		return ;
	}

	if ( !fitsPlace(bot, command, message) )
		return ;
	// TODO message d'erreurs
	if ( await isOnCooldown(bot, command, message) )
		return ;
    
    // if (command.channelsJeu && !bot.channelsJeu.has(message.channel.guild.id) || ( command.channelsJeu && bot.channelsJeu.has(message.channel.guild.id) && bot.channelsJeu.get(message.channel.guild.id) &&  bot.channelsJeu.get(message.channel.guild.id).has(CONSTANTES.GAME_CHANNEL_NAME)) )
	// {
    //     const command2 = bot.commands.get("set_channel") ;
    //     command2.run(bot, message, argv);
    //     if (command.channelsJeu && !bot.channelsJeu.has(message.channel.guild.id))
	// 	{
    //         return await message.channel.send(`Veuillez configurer les channels de Jeu avec \`${CONSTANTES.PREFIX} get_ready\` ou pour changer de channel : \`${CONSTANTES.PREFIX}set_channel\``); 
    //     }
    // }
	argv.shift(); // remove command name
    await command.run(bot, message, argv);
}

export const name = "messageCreate";
