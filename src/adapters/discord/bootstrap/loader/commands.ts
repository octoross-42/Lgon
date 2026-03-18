import type { Client, Message } from 'discord.js';
import { Command } from '../../commands/entity/Command.js';
import type { CommandMeta } from '../../commands/entity/CommandMeta.js';
 
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

const loadCommands =  async (bot: Client, commandDir: string = 'build/discord/commands'): Promise<void> =>
{
	const commandFiles = await fg(['**/*_command.js'], { cwd: commandDir, dot: true, absolute: true });
	console.log(`\nLoading commands...`);

	for (const commandFile of commandFiles)
	{
		console.log(commandFile);
		const commandFileContent: CommandFileContent = await import(pathToFileURL(commandFile).href);
		let command: Command = new Command(commandFileContent.meta, commandFileContent.run);
		console.log(`\t${command.meta.name}`);
		bot.commands.set(command.meta.name, command);
	}
};

export default loadCommands;