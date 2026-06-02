import type { LgonId } from "types/LgonId.js";
import { LgonUser } from "core/game/entities/LgonUser/LgonUser.js";

import { LobbyFlow } from "messagingFlows/flows/Lobby/LobbyFlow.js";
import { Usecase } from "application/context/modules/UsecasesRegistry.js";

import type { Logger } from "infra/Logger.js";

import type { UserStore } from "application/context/modules/UserStore.js";
import type { GameStore } from "application/context/modules/GameStore.js";
import type { FlowRunner } from "messagingFlows/model/FlowRunner.js";
import type { MessagingTarget } from "application/ports/MessagingPort.js";
import { NotifyFlow } from "messagingFlows/flows/Notify/NotifyFlow.js";
import { SwitchGameFlow } from "messagingFlows/flows/Lobby/SwitchGameFlow.js";

export class CreateGameUsecase implements Usecase
{
	constructor(private readonly gameStore: GameStore,
				private readonly userStore: UserStore,
				private readonly flowRunner: FlowRunner,
				private readonly logger: Logger
	) {}


	async run(authorId: LgonId<"user">, originMsgTarget: MessagingTarget): Promise<void>
	{

		let gameId: LgonId<"game"> | null = null;

		let user: LgonUser | undefined = this.userStore.get(authorId);
		if ( !user )
		{
			user = this.userStore.new(authorId);
			if ( !user )
			{
				await this.flowRunner.run(NotifyFlow("INTERNAL_ERROR"), this.userStore.lgon(), originMsgTarget, true);
				return ;
			}
			this.logger.event( { code: "CREATE", data: { whatId: user.id } } );
			console.log("??");
		}
		

		switch ( this.gameStore.new(user) )
		{
			case "SUCCESS":
			{
				await this.flowRunner.run(LobbyFlow, user, originMsgTarget);		
				break ;
			}
			case "CANNOT_LEAVE":
			{
				await this.flowRunner.run(NotifyFlow("CANNOT_LEAVE"), user, originMsgTarget, true);
				break ;
			}
			case "SWITCH":
			{
				await this.flowRunner.run(SwitchGameFlow, user, originMsgTarget, true);
				break ;
			}
		}
	}
}
