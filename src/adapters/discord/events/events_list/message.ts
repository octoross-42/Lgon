import { type Client, type Message } from 'discord.js';
import type { Command } from '../../commands/entity/Command.js';
import { PREFIX } from 'constants.js';
import type { LgonContext } from 'application/context/LgonContext.js';

import { runWithTrace } from 'infra/trace.js';
import type { CommandMeta } from 'adapters/discord/commands/entity/CommandMeta.js';


function getArgv(message: Message): string[] | null
{
	const argv: string[] = message.content.split(/\s+/);
	if (argv.length < 2)
		return (null);
	if (argv[0].toLowerCase() !== PREFIX)
		return (null);
	argv.shift(); // remove PREFIX
	argv[0] = argv[0].toLowerCase();
	return (argv);
}

function getCommand(bot: Client, argv: string[]): Command | undefined
{
	const commandName: string = argv[0];

	return (bot.commands.get(commandName)
				|| bot.commands.find(cmd => cmd.aliases?.includes(commandName)));
}

function fitsPlace(bot: Client, command: Command, message: Message): boolean
{
	if (command.meta.where === "any")
		return (true);
	if (command.meta.where === "DM")
		return ( message.guild ? false: true );
	return ( message.guild? true: false );
}

 function isOnCooldown(bot: Client, command: Command, message: Message): boolean
{
 if (!bot.cooldowns.has(command.meta.name))
		bot.cooldowns.set(command.meta.name, new Map());

	const timeNowMs: number = Date.now();
	
	let commandCdUsers: Map<string, number>;
	if (!bot.cooldowns.has(command.meta.name))
	{
		commandCdUsers = new Map();
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
			// await message.reply({
			// 	content:` Cooldown restant pour \`${command.meta.name}\` pour l'utilisateur \`${message.author.tag}\` : ${timeLeftSec.toFixed(0)} secondes`,
			// 	flags: FLAGS,
		// };
	
			return (true);
		}
	}

	commandCdUsers.set(message.author.id, timeNowMs);
	setTimeout(() => commandCdUsers.delete(message.author.id), cooldownCommandMs);

	return (false);
}

function fitsArgs(commandMeta: CommandMeta,argv: string[])
{
	return (argv.length - 1 >= commandMeta.nbrArgsRequired);

}

function sentWhere(message: Message): string
{
	if (message.guild)
		return ( "guild" );
	return ("dm");
}

async function onMessage(lgon: LgonContext, bot: Client, message: Message): Promise<void>
{
	lgon.logger.event( { code: "MESSAGE", data: { userId: message.author.id, content: message.content } } );

	if ( message.author.bot )
		return ;

	let argv: string[] | null = getArgv(message);
	if ( !argv )
		return ;

	const command: Command | undefined = getCommand(bot, argv);
	
	if ( !command )
	{
		lgon.logger.event( { code: "COMMAND_FAIL", data: { userId: message.author.id, command: argv[0], args: argv.slice(1), reason: "not found" } } );
		return ;
	}

	if ( !fitsArgs(command.meta, argv) )
	{
		lgon.logger.event( { code: "COMMAND_FAIL", data: { userId: message.author.id, command: command.meta.name, args: argv.slice(1), reason: "not enough args" } } );
		return ;
	}
	

	if ( !fitsPlace(bot, command, message) )
	{
		lgon.logger.event( { code: "COMMAND_FAIL", data: { userId: message.author.id, command: command.meta.name, args: argv.slice(1), reason: `sent in ${sentWhere(message)} instead of ${command.meta.where}` } } );
		return ;
	}

	// if ( await isOnCooldown(bot, command, message) )
	// 	return ;
	
  
	argv.shift(); // remove command name
	
	
	lgon.logger.event( { code: "COMMAND_RUN", data: { userId: message.author.id, command: command.meta.name, args: argv } } );
	command.run(lgon, message, argv);
}

export async function onEvent(lgon: LgonContext, bot: Client, message: Message): Promise<void>
{	
	await runWithTrace( async (): Promise<void> => onMessage(lgon, bot, message) );
	
}

export const name = "messageCreate";
