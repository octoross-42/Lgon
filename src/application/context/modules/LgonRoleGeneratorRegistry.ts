import type { LgonId } from "types/LgonId.js";
import type { RoleGenerator } from "core/game/entities/LgonRole/RoleGenerator.js";

export type RoleDescription =
{
	id: LgonId<"role">,
	name: string,
	description: string
}

export class LgonRoleGeneratorRegistry
{
	constructor(private readonly roles: Map<LgonId<"role">, RoleGenerator>) {}

	get(roleName: LgonId<"role">): RoleGenerator | undefined { return ( this.roles.get(roleName) ); }

	getDescriptions(): RoleDescription[]
	{
		let descriptions: RoleDescription[] = [];
		for (const role of this.roles.values())
			descriptions.push( { id: role.meta.id, name: role.meta.name	, description: role.meta.description } );
		
		return (descriptions);
	}
}
