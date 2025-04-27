import { Client } from 'discord.js';
import { LgonRole } from '../types/LgonRole.js';
import fg from 'fast-glob';

const loadRoles = async (bot: Client, eventDir = 'build/roles'): Promise<void> =>
{
	const roleFiles = await fg(['**/*.js'], { cwd: eventDir, dot: true, absolute: true });
	console.log(`\nLoading roles...`);

	for (const roleFile of roleFiles)
	{
		const roleContent = await import(roleFile);
		let role: LgonRole = new LgonRole(roleContent.help, roleFile);
		console.log(`\t${role.name}`);
		bot.roles.set(role.name, role);
	}
};

export { loadRoles }