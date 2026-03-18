import type { RoleGenerator } from "../../domain/game/entities/LgonRole/RoleGenerator.js";
import type { Game } from "../../domain/game/entities/Game/Game.js";
import type { LgonUser } from "../../domain/game/entities/LgonUser.js";
import type { LgonId } from "../../types/LgonId.js";
// import type { LgonProperty } from "../../../tochange/LgonProperty.js";
// import type { ActionFlow } from "../../../tochange/Flow/ActionFlow/ActionFlow.js";

export class LgonContext
{
	public readonly roles: Map<LgonId<"role">, RoleGenerator>;
	public readonly games: Map<LgonId<"game">, Game>;
	public readonly users: Map<LgonId<"user">, LgonUser>;
	// public readonly activeFlows: Map<LgonId<"embed">, ActionFlow>
	// public readonly onPropertyUpdate: Map<LgonProperty, (prop: LgonProperty) => void>;

	constructor()
	{
		this.roles = new Map<LgonId<"role">, RoleGenerator>();
		this.games = new Map<LgonId<"game">, Game>();
		this.users = new Map<LgonId<"user">, LgonUser>();
		// this.activeFlows = new Map<LgonId<"embed">, ActionFlow>();
		// this.onPropertyUpdate = new Map<LgonProperty, (prop: LgonProperty) => void>;
	}
}
