import { type Client, type Message, Collection } from 'discord.js';
import type { Command } from '../commands/entity/Command.js';
import { CONSTANTES } from '../../../config/constantes.js';

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

function getCommand(bot: Client, argv: string[]): Command | null
{
    const commandName:string = argv[0];

    const command = bot.commands.get(commandName)
						|| bot.commands.find(cmd => cmd.aliases?.includes(commandName));
    if (!command)
		return (null);

    if (argv.length - 1 < command.meta.nbrArgsRequired)
	{
		// TODO send help pour la commande
		return (null);
	}
	return (command);
}

function fitsPlace(bot: Client, command: Command, message: Message): boolean
{

	// TODO creer des fils pour mieux organiser la partie
	// console.log(message, message.channel);
	if (command.meta.where === "any")
		return (true);
	if (command.meta.where === "DM")
	{
		if ( message.guild )
			return (false);
		return (true);
	}
	else if ( message.guild )
		return (true);
	return (false);
}

async function isOnCooldown(bot: Client, command: Command, message: Message): Promise<boolean>
{
 if (!bot.cooldowns.has(command.meta.name))
        bot.cooldowns.set(command.meta.name, new Collection());

    const timeNowMs: number = Date.now();
	
	let commandCdUsers: Collection<string, number>;
	if (!bot.cooldowns.has(command.meta.name))
	{
		commandCdUsers = new Collection();
		bot.cooldowns.set(command.meta.name, commandCdUsers);
	}
    else
		commandCdUsers = bot.cooldowns.get(command.meta.name)!;
    
	const cooldownCommandMs: number = command.meta.cooldown * 1000;

    if (commandCdUsers.has(message.author.id))
	{
        const endDownCooldownTimeMs: number = commandCdUsers.get(message.author.id)! + cooldownCommandMs;
        
        if (timeNowMs < endDownCooldownTimeMs)
		{
			const timeLeftSec: number = (endDownCooldownTimeMs - timeNowMs) / 1000;
            await message.reply({
				content:` Cooldown restant pour \`${command.meta.name}\` pour l'utilisateur \`${message.author.tag}\` : ${timeLeftSec.toFixed(0)} secondes`,
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
	const command: Command | null = getCommand(bot, argv);
	if ( !command )
	{
		// const role: RoleGenerator | null = getRole(bot, argv[0]);
		// if ( !role )
		// 	return ;

		// help_role(message, role);
		return ;
	}

	if ( !fitsPlace(bot, command, message) )
		return ;
	// TODO message d'erreurs
	if ( await isOnCooldown(bot, command, message) )
		return ;
    
  
	argv.shift(); // remove command name
    await command.run(bot.lgon, message, argv);
}

export const name = "messageCreate";
