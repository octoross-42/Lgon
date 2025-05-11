import { LgonRoleGenerator } from '../classes/LgonRole/LgonRoleGenerator.js';
import fg from 'fast-glob';
const loadRoles = async (bot, eventDir = 'build/roles') => {
    const roleFiles = await fg(['**/*.js'], { cwd: eventDir, dot: true, absolute: true });
    console.log(`\nLoading roles...`);
    for (const roleFile of roleFiles) {
        const roleContent = await import(roleFile);
        let role = new LgonRoleGenerator(roleContent.help, roleContent.roleGenerator);
        console.log(`\t${role.name}`);
        bot.roles.set(role.name, role);
    }
};
export { loadRoles };
