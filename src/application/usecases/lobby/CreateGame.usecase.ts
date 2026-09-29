import type { LgonId } from "types/LgonId.js";
import { LgonUser } from "core/game/entities/LgonUser/LgonUser.js";

import { LobbyFlow } from "application/messaging/flows/Lobby/LobbyFlow.js";
import { Usecase } from "application/context/modules/UsecasesRegistry.js";

import type { Logger } from "infra/Logger.js";

import type { UserStore } from "application/context/modules/UserStore.js";
import type { GameStore } from "application/context/modules/GameStore.js";
import type { FlowRunner } from "application/messaging/model/FlowRunner.js";
import type { MessagingTarget } from "application/ports/MessagingPort.js";
import { NotifyFlow } from "application/messaging/flows/Notify/NotifyFlow.js";
import { SwitchGameFlow } from "application/messaging/flows/Lobby/SwitchGameFlow.js";
import { CannotLeaveScript } from "application/messaging/flows/Notify/scripts/cannot_leave.js";
import type { UserViewCtx } from "application/messaging/model/ViewStore.js";
import type { MessagingDirective, AnyMessagingDirective } from "application/ports/MessagingDirective.js";
import type { DataFlow } from "application/messaging/model/Flow.js";

export class CreateGameUsecase implements Usecase
{
	constructor(private readonly gameStore: GameStore,
				private readonly userStore: UserStore,
				private readonly flowRunner: FlowRunner,
				private readonly logger: Logger
	) {}


	async run(authorId: LgonId<"user">, originMsgTarget: MessagingTarget, authorName: string): Promise<AnyMessagingDirective<DataFlow>[]>
	{

		let gameId: LgonId<"game"> | null = null;

		let user: LgonUser = this.userStore.getOrCreate(authorId, authorName);

		const res = this.gameStore.new(user);
		const userViewCtx: UserViewCtx = {
			userId: user.id,
			stepMode: user.preferences.stepMode
		}
		
		switch ( res.status )
		{
			case "SUCCESS":
			{
				return ( [{
					kind: "flow",
					flow: LobbyFlow,
					userCtx: userViewCtx,
					target: originMsgTarget,
					data: { gameId: res.game.meta.id, gameStore: this.gameStore, logger: this.logger }
				}] );

				// await this.flowRunner.run(LobbyFlow, userViewCtx, originMsgTarget, { gameId: res.game.meta.id, gameStore: this.gameStore, logger: this.logger } );		
				// break ;
			}
			case "CANNOT_LEAVE":
			{
				return ( [{
					kind: "simple",
					script: CannotLeaveScript,
					target: { kind: "personal-reply" },
				}] );

				// await this.flowRunner.run(NotifyFlow(CannotLeaveScript), userViewCtx, originMsgTarget, undefined);
				// break ;
			}
			case "SWITCH":
			{
				return ( [{
					kind: "flow",
					flow: SwitchGameFlow,
					userCtx: userViewCtx,
					target: { kind: "personal-reply" },
					data: { userId: user.id, userStore: this.userStore, gameStore: this.gameStore, logger: this.logger }
				}] );

				// await this.flowRunner.run(SwitchGameFlow, userViewCtx, originMsgTarget, { userId: user.id, userStore: this.userStore, gameStore: this.gameStore, logger: this.logger });
				// break ;
			}
		}
		
		return ([]);
	}
}
