import { ViewStore } from "./ViewStore.js";
import type { Flow, FlowData } from "./Flow.js";
import type { LgonUser } from "core/game/entities/LgonUser/LgonUser.js";
import type { MessagingPort, MessagingTarget } from "application/ports/MessagingPort.js";
import type { Logger } from "infra/Logger.js";
import type { GameStore } from "application/context/modules/GameStore.js";
import type { UserStore } from "application/context/modules/UserStore.js";
import type { View } from "./View.js";

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

	async run<T extends FlowData>(flow: Flow<T>, author: LgonUser, originMsgTarget: MessagingTarget, flowData: T, ephemeral: boolean = false): Promise<void>
	{
		const views = this.viewStore.new(flow, author, originMsgTarget, flowData);
		this.messenger.send(views, originMsgTarget, ephemeral);
	}

	update<T extends FlowData>(view: View<T>)
	{
		this.messenger.update(view);
	}

	delete<T extends FlowData>(view: View<T>)
	{
		this.messenger.delete(view);
	}
}