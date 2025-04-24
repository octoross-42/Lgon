import { Client } from 'discord.js';
import { Role } from '../types/Role.js';
import fg from 'fast-glob';

const loadRoles = async (bot: Client, eventDir = 'build/roles'): Promise<void> =>
{
	const roleFiles = await fg(['**/*.js'], { cwd: eventDir, dot: true, absolute: true });
	  
	for (const roleFile of roleFiles)
	{
		const roleContent = await import(roleFile);
		let role: Role = new Role(roleContent.help, roleFile);
		// console.log(`Loading role file: ${role.name} ${role.category}`);
		bot.roles.set(role.name, role);
	}
};

export { loadRoles }