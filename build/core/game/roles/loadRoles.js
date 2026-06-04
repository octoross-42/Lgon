import { pathToFileURL } from "node:url";
import fg from 'fast-glob';
import { LgonRoleGeneratorRegistry } from '../../../application/context/modules/LgonRoleGeneratorRegistry.js';
function loadRole(roles, generator) {
    console.log(`\t${generator.meta.id}`);
    roles.set(generator.meta.id, generator);
    // for (const alias of generator.meta.aliases)
    // 	roles.set(makeLgonId<"role">("role", alias), generator); // TODO check duplicate
}
export const loadRoles = async (eventDir = 'build/core/game/roles') => {
    let roles = new Map();
    const roleFiles = await fg(['**/*_generator.js'], { cwd: eventDir, dot: true, absolute: true });
    console.log(`\nLoading roles...`);
    for (const roleFile of roleFiles) {
        const roleFileContent = await import(pathToFileURL(roleFile).href);
        loadRole(roles, roleFileContent.roleGenerator);
    }
    return (new LgonRoleGeneratorRegistry(roles));
};
