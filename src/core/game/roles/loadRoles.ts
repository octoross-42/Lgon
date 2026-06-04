import type { LgonContext } from 'application/context/LgonContext.js';
import type { RoleGenerator } from 'core/game/entities/LgonRole/RoleGenerator.js';
import { makeLgonId, type LgonId } from 'types/LgonId.js';

import { pathToFileURL } from "node:url";
import fg from 'fast-glob';
import { LgonRoleGeneratorRegistry } from 'application/context/modules/LgonRoleGeneratorRegistry.js';

type RoleFileContent =
{
	roleGenerator: RoleGenerator;
}


function loadRole(roles: Map<LgonId<"role">, RoleGenerator>, generator: RoleGenerator): void
{
	console.log(`\t${generator.meta.id}`);
	roles.set(generator.meta.id, generator);
	// for (const alias of generator.meta.aliases)
	// 	roles.set(makeLgonId<"role">("role", alias), generator); // TODO check duplicate

}

export const loadRoles = async (eventDir = 'build/core/game/roles'): Promise< LgonRoleGeneratorRegistry > =>
{
	let roles: Map<LgonId<"role">, RoleGenerator> = new Map<LgonId<"role">, RoleGenerator>();

	const roleFiles = await fg(['**/*_generator.js'], { cwd: eventDir, dot: true, absolute: true });
	console.log(`\nLoading roles...`);

	for (const roleFile of roleFiles)
	{
		const roleFileContent : RoleFileContent
			= await import(pathToFileURL(roleFile).href);
		loadRole(roles, roleFileContent.roleGenerator);
	}
	return ( new LgonRoleGeneratorRegistry(roles) );
};
