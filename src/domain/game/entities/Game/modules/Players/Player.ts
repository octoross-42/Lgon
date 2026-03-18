import type { NightRole } from "../../../LgonRole/NightRole.js";
import type { LgonStatus } from "./LgonStatus.js";
import type { RoleGenerator } from "../../../LgonRole/RoleGenerator.js";
import type { LgonUser } from "../../../LgonUser.js";

export class Player
{
	user: LgonUser;
	role: NightRole | null;
	actionRole: NightRole | null;
	// dayRole: DayRole | null;
	ready: boolean;
	status: Set<LgonStatus>;

	constructor(user: LgonUser)
	{
		this.role = null;
		this.actionRole = null;
		this.ready = false;
		this.user = user;
		this.status = new Set<LgonStatus>();
	}


	
	attributeRole(role: RoleGenerator): void
	{
		this.actionRole = role.generateRole(this, 1);

	}

}