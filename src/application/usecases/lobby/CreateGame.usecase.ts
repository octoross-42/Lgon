import type { LgonId } from "types/LgonId.js";
import { LgonUser } from "core/game/entities/LgonUser/LgonUser.js";

import { LobbyFlow } from "application/messaging/flows/Lobby/LobbyFlow.js";
import { Usecase } from "application/context/modules/UsecasesRegistry.js";

import type { Logger } from "infra/Logger.js";

import type { UserStore } from "application/context/modules/UserStore.js";
import type { GameStore } from "application/context/modules/GameStore.js";
import type { FlowRunner } from "application/messaging/model/FlowRunner.js";
import type { AnyMessagingRequest, MessagingTarget, MessagingSource } from "application/ports/MessagingDirective.js";
import { SwitchGameFlow } from "application/messaging/flows/Lobby/SwitchGameFlow.js";
import { CannotLeaveScript } from "application/messaging/flows/Notify/scripts/cannot_leave.js";
import type { UserViewCtx } from "application/messaging/model/ViewStore.js";
import type { DataFlow } from "application/messaging/model/Flow.js";
import type { AdapterKind } from "application/ports/MessagingPort.js";

export class CreateGameUsecase implements Usecase
{
	constructor(private readonly gameStore: GameStore,
				private readonly userStore: UserStore,
				private readonly flowRunner: FlowRunner,
				private readonly logger: Logger
	) {}


	async run(authorId: LgonId<"user">, originMsgTarget: MessagingTarget, authorName: string, source: MessagingSource<AdapterKind>): Promise<AnyMessagingRequest<DataFlow>[]>
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
					msg: {
						kind: "flow",
						flow: LobbyFlow,
						userCtx: userViewCtx,
						data: { gameId: res.game.meta.id, gameStore: this.gameStore, logger: this.logger }
					},
					intention: "reply",
					source: source
				}] );

				// await this.flowRunner.run(LobbyFlow, userViewCtx, originMsgTarget, { gameId: res.game.meta.id, gameStore: this.gameStore, logger: this.logger } );		
				// break ;
			}
			case "CANNOT_LEAVE":
			{
				return ( [{
					msg: {
						kind: "simple",
						script: CannotLeaveScript,
					},
					intention: "error",
					source: source
				}] );

				// await this.flowRunner.run(NotifyFlow(CannotLeaveScript), userViewCtx, originMsgTarget, undefined);
				// break ;
			}
			case "SWITCH":
			{
				return ( [{
					msg: {
						kind: "flow",
						flow: SwitchGameFlow,
						userCtx: userViewCtx,
						data: { userId: user.id, userStore: this.userStore, gameStore: this.gameStore, logger: this.logger }
					},
					intention: "personal-reply",
					source: source
				}] );

				// await this.flowRunner.run(SwitchGameFlow, userViewCtx, originMsgTarget, { userId: user.id, userStore: this.userStore, gameStore: this.gameStore, logger: this.logger });
				// break ;
			}
		}
		
		return ([]);
	}
}
