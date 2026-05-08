import type { RoleGenerator } from "../../core/game/entities/LgonRole/RoleGenerator.js";
import type { Game } from "../../core/game/entities/Game/Game.js";
import type { LgonUser } from "../../core/game/entities/LgonUser/LgonUser.js";
import type { LgonId } from "../../types/LgonId.js";
import { SequenceStore } from "../../messagingFlows/store/SequenceStore.js";
import { UseCase } from "application/entities/UseCase.js";

export class LgonContext
{
	public readonly roles: Map<LgonId<"role">, RoleGenerator>;
	public readonly games: Map<LgonId<"game">, Game>;
	public readonly users: Map<LgonId<"user">, LgonUser>;
	
	public readonly usecases: Record<string, UseCase>;
	// public readonly onPropertyUpdate: Map<LgonProperty, (prop: LgonProperty) => void>;

	public readonly sequenceStore: SequenceStore;

	constructor()
	{
		this.roles = new Map<LgonId<"role">, RoleGenerator>();
		this.games = new Map<LgonId<"game">, Game>();
		this.users = new Map<LgonId<"user">, LgonUser>();
		// this.activeFlows = new Map<LgonId<"embed">, ActionFlow>();
		// this.onPropertyUpdate = new Map<LgonProperty, (prop: LgonProperty) => void>;
	
		this.usecases = {};

		this.sequenceStore = new SequenceStore(this);
	}

	getUserStepMode(userId: LgonId<"user">): "compact" | "long"
	{
		const user: LgonUser | undefined = this.users.get(userId);
		if ( !user )
			return ("compact");
		return ( user.preferences.stepMode );
	}
}
