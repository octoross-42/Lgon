import type { LgonId } from "types/LgonId.js";
import { LgonUser } from "core/game/entities/LgonUser/LgonUser.js";
import { Game } from "core/game/entities/Game/Game.js";
import { Usecase, type UsecasesRegistry } from "application/context/modules/UsecasesRegistry.js";
import type { UserStore } from "application/context/modules/UserStore.js";
import type { Logger } from "infra/Logger.js";
import type { GameStore } from "application/context/modules/GameStore.js";
import type { FlowRunner } from "messagingFlows/model/FlowRunner.js";

export class StartGameUsecase implements Usecase
{
	constructor(private readonly gameStore: GameStore,
				private readonly userStore: UserStore,
				private readonly flowRunner: FlowRunner,
				private readonly logger: Logger
	) {}

	async run(authorId: LgonId<"user">): Promise<void>
	{
	}
}
