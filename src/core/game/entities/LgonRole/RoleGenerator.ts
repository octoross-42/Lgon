import type { LgonRoleMeta } from "./LgonRoleMeta.js";
import type { NightRole } from "./NightRole.js"
import type { Player } from "../Game/modules/Players/Player.js";

export class RoleGenerator
{
	constructor(public readonly meta : LgonRoleMeta,
				private readonly NightRole: new (meta: LgonRoleMeta, owner: Player | string) => NightRole)
	{
		Object.assign(this, meta);
	}
	generateRole(owner: Player | string, id: number): NightRole { return new this.NightRole(this.meta, owner); }
}
