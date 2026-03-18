import type { LgonContext } from '../../../../application/context/LgonContext.js';
import type { RoleGenerator } from '../../../../domain/game/entities/LgonRole/RoleGenerator.js';
import { makeLgonId } from '../../../../types/LgonId.js';

import { pathToFileURL } from "node:url";
import fg from 'fast-glob';

type RoleFileContent =
{
	roleGenerator: RoleGenerator;
}


function loadRole(lgon: LgonContext, generator: RoleGenerator): void
{
	console.log(`\t${generator.meta.name}`);
	lgon.roles.set(makeLgonId<"role">("role", generator.meta.name), generator);
	for (const alias of generator.meta.aliases)
		lgon.roles.set(makeLgonId<"role">("role", alias), generator);

}

const loadRoles = async (lgon: LgonContext, eventDir = 'build/core/roles'): Promise<void> =>
{
	const roleFiles = await fg(['**/*_generator.js'], { cwd: eventDir, dot: true, absolute: true });
	console.log(`\nLoading roles...`);

	for (const roleFile of roleFiles)
	{
		const roleFileContent : RoleFileContent
			= await import(pathToFileURL(roleFile).href);
		loadRole(lgon, roleFileContent.roleGenerator);
	}
};

export default loadRoles;