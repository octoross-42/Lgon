import { DEFAULT_USER_STEPMODE } from "constants.js";
import { LgonUser } from "../../core/game/entities/LgonUser/LgonUser.js";
import { makeLgonId, type LgonId } from "../../types/LgonId.js";
import { UsecasesRegistry } from "application/context/modules/UsecasesRegistry.js";
import type { Logger } from "infra/Logger.js";
import { GameStore } from "./modules/GameStore.js";
import { UserStore } from "./modules/UserStore.js";

import { loadUsescases } from "application/usecases/loadUsecases.js";
import { LgonRoleGeneratorRegistry } from "./modules/LgonRoleGeneratorRegistry.js";
import { loadRoles } from "core/game/roles/loadRoles.js";
import type { FlowRunner } from "application/messaging/model/FlowRunner.js";
import { InteractionRegistry } from "./modules/InteractionRegistry.js";
import { loadInteractions } from "application/messaging/loadInteractions.js";

export class LgonContext
{	
	public readonly usecases: UsecasesRegistry;
	public readonly interactions: InteractionRegistry
	// public readonly onPropertyUpdate: Map<LgonProperty, (prop: LgonProperty) => void>;

	constructor(public roles: LgonRoleGeneratorRegistry,
				public readonly gameStore: GameStore,
				public readonly userStore: UserStore,
				public readonly flowRunner: FlowRunner,
				public readonly logger: Logger)
	{
		this.usecases = loadUsescases(this.gameStore, this.userStore, this.flowRunner, this.logger);
		this.interactions = loadInteractions(flowRunner.viewStore, this.gameStore, this.userStore, this.flowRunner, this.logger);
		// this.onPropertyUpdate = new Map<LgonProperty, (prop: LgonProperty) => void>;
	}

	getStepMode(userId: LgonId<"user">): "compact" | "long"
	{
		const user: LgonUser | undefined = this.userStore.get(userId);
		if ( !user )
			return ( DEFAULT_USER_STEPMODE );
		return ( user.preferences.stepMode );
	}
}
