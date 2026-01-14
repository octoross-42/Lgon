import { Client } from 'discord.js';
import { LgonRoleGenerator } from '../classes/LgonRole/LgonRoleGenerator.js';
import { LgonRole } from "../classes/LgonRole/LgonRole.js";

import { pathToFileURL } from "node:url";
import fg from 'fast-glob';

const loadRoles = async (bot: Client, eventDir = 'build/roles'): Promise<void> =>
{
	const roleFiles = await fg(['**/*.js'], { cwd: eventDir, dot: true, absolute: true });
	console.log(`\nLoading roles...`);

	for (const roleFile of roleFiles)
	{
		const { roleGenerator }: { roleGenerator: LgonRoleGenerator; }
			= await import(pathToFileURL(roleFile).href);
		console.log(`\t${roleGenerator.name}`);
		bot.roles.set(roleGenerator.name, roleGenerator.name);
	}
};

export { loadRoles }