import { Client, LgonRoleHelp } from 'discord.js';
import { LgonRoleGenerator } from '../classes/LgonRole/LgonRoleGenerator.js';
import { LgonRole } from "../classes/LgonRole/LgonRole.js";
import { Player } from '../classes/Game/Player.js';
import fg from 'fast-glob';

const loadRoles = async (bot: Client, eventDir = 'build/roles'): Promise<void> =>
{
	const roleFiles = await fg(['**/*.js'], { cwd: eventDir, dot: true, absolute: true });
	console.log(`\nLoading roles...`);

	for (const roleFile of roleFiles)
	{
		const roleContent: {
			help: LgonRoleHelp,
			roleGenerator: <R extends LgonRole>(help : LgonRoleHelp, printName: string, owner: Player | string, id: number) => R;
		} = await import(roleFile);
		let role: LgonRoleGenerator = new LgonRoleGenerator(roleContent.help, roleContent.roleGenerator);
		console.log(`\t${role.name}`);
		bot.roles.set(role.name, role);
	}
};

export { loadRoles }