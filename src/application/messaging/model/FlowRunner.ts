import { type UserViewCtx, ViewStore } from "./ViewStore.js";
import type { Flow, DataFlow } from "./Flow.js";
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

	constructor(readonly messenger: MessagingPort,
				gameStore: GameStore,
				userStore: UserStore,
				readonly logger: Logger)
	{
		this.viewStore = new ViewStore(gameStore, userStore,this.logger);
	}

	async run<T extends DataFlow>(flow: Flow<T>, authorViewCtx: UserViewCtx, originMsgTarget: MessagingTarget, flowData: T): Promise<void>
	{
		const views = this.viewStore.new(flow, authorViewCtx, originMsgTarget, flowData);
		this.messenger.send(views, originMsgTarget);
	}

	update<T extends DataFlow>(view: View<T>)
	{
		this.messenger.update(view);
	}

	delete<T extends DataFlow>(view: View<T>)
	{
		this.messenger.delete(view);
	}
}