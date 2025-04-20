import { Client, Command } from 'discord.js';
import fg from 'fast-glob';

const loadCommands =  async (bot: Client, commandDir: string = 'build/commands'): Promise<void> =>
{
	const commandFiles = await fg(['**/*.ts'], { cwd: commandDir, dot: true, absolute: true });
	  
	for (const file of commandFiles)
	{
		const command: Command = await import(file);
		bot.commands.set(command.help.name, command);
	}
	
	console.log(commandFiles);
};

export { loadCommands }