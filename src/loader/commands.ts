import { Client, CommandHelp } from 'discord.js';
import { Command } from '../types/Command.js';
import fg from 'fast-glob';

const loadCommands =  async (bot: Client, commandDir: string = 'build/commands'): Promise<void> =>
{
	const commandFiles = await fg(['**/*.js'], { cwd: commandDir, dot: true, absolute: true });
	  
	for (const commandFile of commandFiles)
	{
		const commandContent = await import(commandFile);
		let command: Command = new Command(commandContent.help, commandFile, commandContent.run);
		// console.log(`Loading command file: ${command.name} ${command.category}`);
		bot.commands.set(command.name, command);
	}
};

export { loadCommands }