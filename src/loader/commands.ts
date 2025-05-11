import { Client, CommandHelp } from 'discord.js';
import { BotCommand } from '../classes/Commands/BotCommand.js';
import fg from 'fast-glob';

const loadCommands =  async (bot: Client, commandDir: string = 'build/commands'): Promise<void> =>
{
	const commandFiles = await fg(['**/*.js'], { cwd: commandDir, dot: true, absolute: true });
	console.log(`\nLoading commands...`);

	for (const commandFile of commandFiles)
	{
		const commandContent = await import(commandFile);
		let command: BotCommand = new BotCommand(commandContent.help, commandFile, commandContent.run);
		console.log(`\t${command.name}`);
		bot.commands.set(command.name, command);
	}
};

export { loadCommands }