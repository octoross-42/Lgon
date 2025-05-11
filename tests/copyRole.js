import { LgonRoleGenerator } from "../build/types/LgonRoleGenerator.js"
import fg from 'fast-glob';

const loadRoles = async (eventDir = 'build/roles') =>
{
	const roleFiles = await fg(['**/*.js'], { cwd: eventDir, dot: true, absolute: true });
	console.log(`\nLoading roles...`);
	let roles = [];

	for (const roleFile of roleFiles)
	{
		const roleContent = await import(roleFile);
		let role = new LgonRoleGenerator(roleContent.help, roleContent.roleGenerator);
		roles.push(role);
	}
	return (roles);
};

let roles = await loadRoles();
let rolecopy = roles.find(r => r.name = "villageois")?.generateRole("bouhou", "4");
console.log(rolecopy);
rolecopy.preshot_action();
