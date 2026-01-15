import { Client, } from 'discord.js';
import { LgonRoleGenerator } from '../classes/LgonRole/LgonRoleGenerator.js';

import { pathToFileURL } from "node:url";
import fg from 'fast-glob';

type RoleFileContent =
{
	roleGenerator: LgonRoleGenerator;
}

const loadRoles = async (bot: Client, eventDir = 'build/roles'): Promise<void> =>
{
	const roleFiles = await fg(['**/*_generator.js'], { cwd: eventDir, dot: true, absolute: true });
	console.log(`\nLoading roles...`);
	console.log(roleFiles);

	for (const roleFile of roleFiles)
	{
		console.log(roleFile);
		const roleFileContent : RoleFileContent
			= await import(pathToFileURL(roleFile).href);
		console.log(`\t${roleFileContent.roleGenerator.name}`);
		bot.roles.set(roleFileContent.roleGenerator.name, roleFileContent.roleGenerator);
	}
};

export default loadRoles;