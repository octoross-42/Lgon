import type { LgonId } from "types/LgonId.js";
import type { RoleGenerator } from "core/game/entities/LgonRole/RoleGenerator.js";

export class LgonRoleGeneratorRegistry
{
	constructor(private readonly roles: Map<LgonId<"role">, RoleGenerator>) {}

	get(roleName: LgonId<"role">): RoleGenerator | undefined { return ( this.roles.get(roleName) ); }
}
