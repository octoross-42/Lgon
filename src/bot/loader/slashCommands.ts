import type { Client, CommandMeta } from 'discord.js';
// import { BotCommand } from '../../commands/BotCommand.js';
import fg from 'fast-glob';

const loadSlashCommands =  async (bot: Client, commandDir: string = 'build/slashCommands'): Promise<void> =>
{
	const commandFiles = await fg(['**/*.js'], { cwd: commandDir, dot: true, absolute: true });
	console.log(`\nLoading slash commands...`);

	for (const commandFile of commandFiles)
	{
		const commandContent = await import(commandFile);
		// let command: BotCommand = new BotCommand(commandContent.help, commandFile, commandContent.run);
		// console.log(`\t${command.name}`);
		// bot.slashCommands.set(command.name, command);
	}
};

export default loadSlashCommands;