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
import { InternalErrorScript } from "application/messaging/flows/Notify/scripts/internal_error.js";
import { CannotLeaveScript } from "application/messaging/flows/Notify/scripts/cannot_leave.js";

export class CreateGameUsecase implements Usecase
{
	constructor(private readonly gameStore: GameStore,
				private readonly userStore: UserStore,
				private readonly flowRunner: FlowRunner,
				private readonly logger: Logger
	) {}


	async run(authorId: LgonId<"user">, originMsgTarget: MessagingTarget, authorName: string): Promise<void>
	{

		let gameId: LgonId<"game"> | null = null;

		let user: LgonUser | undefined = this.userStore.get(authorId);
		if ( !user )
		{
			user = this.userStore.new(authorId, authorName);
			if ( !user )
			{
				await this.flowRunner.run(NotifyFlow(InternalErrorScript), this.userStore.lgon(), originMsgTarget, undefined, true);
				return ;
			}
			this.logger.event( { code: "CREATE", data: { whatId: user.id } } );
		}
		
		const res = this.gameStore.new(user);
		switch ( res.status )
		{
			case "SUCCESS":
			{
				await this.flowRunner.run(LobbyFlow, user, originMsgTarget, { gameId: res.game.meta.id, gameStore: this.gameStore, logger: this.logger } );		
				break ;
			}
			case "CANNOT_LEAVE":
			{
				await this.flowRunner.run(NotifyFlow(CannotLeaveScript), user, originMsgTarget, undefined, true);
				break ;
			}
			case "SWITCH":
			{
				await this.flowRunner.run(SwitchGameFlow, user, originMsgTarget, { userId: user.id, userStore: this.userStore, gameStore: this.gameStore, logger: this.logger }, true);
				break ;
			}
		}
	}
}
