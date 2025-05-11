import { LgonRoleGenerator } from "../LgonRole/LgonRoleGenerator.js";

export class InGame
{
	role: LgonRoleGenerator;
	nightyRole: LgonRoleGenerator;
	ready: boolean;

	constructor(role: LgonRoleGenerator)
	{
		this.ready = false;
		this.role = role;
		this.nightyRole = role;
	}

	setReady(ready: boolean): void
	{
		this.ready = ready;
	}
}