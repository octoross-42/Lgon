import { Client, Role } from 'discord.js';
import fg from 'fast-glob';

const loadRoles = async (bot: Client, eventDir = 'build/roles'): Promise<void> =>
{
	const roleFiles = await fg(['**/*'], { cwd: eventDir, dot: true, absolute: true });
	  
	for (const roleFile of roleFiles)
	{
		const role: Role = await import(roleFile);
		bot.roles.set(role.help.name, role);
	}
};

export { loadRoles }