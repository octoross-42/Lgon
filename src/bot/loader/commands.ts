import type { Client, CommandMeta, Message } from 'discord.js';
import { BotCommand } from '../../commands/BotCommand.js';

import { pathToFileURL } from "node:url";
import fg from 'fast-glob';

type CommandFileContent =
{
	meta: CommandMeta;
	run: (
		bot: Client,
		message: Message,
		argv: string[]) => void | Promise<void>
}

const loadCommands =  async (bot: Client, commandDir: string = 'build/commands'): Promise<void> =>
{
	const commandFiles = await fg(['**/*.js'], { cwd: commandDir, dot: true, absolute: true });
	console.log(`\nLoading commands...`);

	for (const commandFile of commandFiles)
	{
		const commandFileContent: CommandFileContent = await import(pathToFileURL(commandFile).href);
		let command: BotCommand = new BotCommand(commandFileContent.meta, commandFile, commandFileContent.run);
		console.log(`\t${command.name}`);
		bot.commands.set(command.name, command);
	}
};

export default loadCommands;