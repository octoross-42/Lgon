import type { Client } from "discord.js"
import type { LgonRoleGenerator } from "../roles/LgonRoleGenerator.js"

export function getRoleName(bot: Client, roleName : string) : string | null
{
	if (bot.roles.has(roleName))
		return (roleName);
	let role: LgonRoleGenerator | undefined = bot.roles.find(roleFile => roleFile.aliases?.includes(roleName));
	if ( !role )
		return (null);
	return (role.name);
}

export function getRole(bot: Client, roleName: string): LgonRoleGenerator | null
{
	let role: LgonRoleGenerator | undefined = bot.roles.get(roleName)
			|| bot.roles.find(roleFile => roleFile.aliases?.includes(roleName));
	if ( !role )
		return (null);
	return (role);
}
