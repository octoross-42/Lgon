import { ViewStore } from "./ViewStore.js";
import type { Flow } from "./Flow.js";
import type { LgonUser } from "core/game/entities/LgonUser/LgonUser.js";
import type { MessagingPort, MessagingTarget } from "application/ports/MessagingPort.js";
import type { Logger } from "infra/Logger.js";
import type { GameStore } from "application/context/modules/GameStore.js";
import type { UserStore } from "application/context/modules/UserStore.js";
import type { LgonId } from "types/LgonId.js";
import type { MessageView } from "./View.js";

export class FlowRunner
{
	public readonly viewStore: ViewStore;
	// private readonly updateOn: Map<LgonId<"">, LgonId<"view">[]>

	constructor(private readonly messenger: MessagingPort,
				gameStore: GameStore,
				userStore: UserStore,
				private readonly logger: Logger)
	{
		this.viewStore = new ViewStore(gameStore, userStore,this.logger);
	}

	async run(flow: Flow, author: LgonUser, originMsgTarget: MessagingTarget, blockData: any, ephemeral: boolean = false): Promise<void>
	{
		const views = this.viewStore.new(flow, author, originMsgTarget, blockData);
		this.messenger.send(views, author, originMsgTarget, ephemeral);
	}

	updateView(view: MessageView)
	{
		this.messenger.update(view);
	}
}