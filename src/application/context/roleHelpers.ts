import type { LgonId } from "../../types/LgonId.js"; 
import type { RoleGenerator } from "../../domain/game/entities/LgonRole/RoleGenerator.js";
import { LgonContext } from "./LgonContext.js";

export function getRoleName(lgon: LgonContext, roleName : LgonId<"role">) : string | null
{
	if (lgon.roles.has(roleName))
		return (roleName);
	let role: RoleGenerator | undefined = lgon.roles.get(roleName);
	if ( !role )
		return (null);
	return (role.meta.name);
}

export function getRole(lgon: LgonContext, roleName: LgonId<"role">): RoleGenerator | null
{
	let role: RoleGenerator | undefined = lgon.roles.get(roleName);
	if ( !role )
		return (null);
	return (role);
}
