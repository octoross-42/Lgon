import type { Client } from 'discord.js';
import fg from 'fast-glob';

const loadSlashCommands =  async (bot: Client, commandDir: string = 'build/discord/slashCommands'): Promise<void> =>
{
	const commandFiles = await fg(['**/*.js'], { cwd: commandDir, dot: true, absolute: true });
	console.log(`\nLoading slash commands...`);

	for (const commandFile of commandFiles)
	{
		const commandContent = await import(commandFile);
		// let command: Command = new Command(commandContent.help, commandFile, commandContent.run);
		// console.log(`\t${command.name}`);
		// bot.slashCommands.set(command.name, command);
	}
};

export default loadSlashCommands;