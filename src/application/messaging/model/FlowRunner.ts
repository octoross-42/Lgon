import { ViewStore } from "./ViewStore.js";
import type { Flow } from "./Flow.js";
import type { LgonUser } from "core/game/entities/LgonUser/LgonUser.js";
import type { MessagingPort, MessagingTarget } from "application/ports/MessagingPort.js";
import type { Logger } from "infra/Logger.js";
import type { GameStore } from "application/context/modules/GameStore.js";
import type { UserStore } from "application/context/modules/UserStore.js";

export class FlowRunner
{
	private readonly viewStore: ViewStore;

	constructor(private readonly messenger: MessagingPort,
				gameStore: GameStore,
				userStore: UserStore,
				private readonly logger: Logger)
	{
		this.viewStore = new ViewStore(gameStore, userStore,this.logger);
	}

	async run(flow: Flow, author: LgonUser, originMsgTarget: MessagingTarget, ephemeral: boolean = false): Promise<void>
	{
		const views = this.viewStore.new(flow, author, originMsgTarget);

		this.messenger.send(views, author, originMsgTarget, ephemeral);
	}
}