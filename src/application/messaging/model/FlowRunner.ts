import { type UserViewCtx, ViewStore } from "./ViewStore.js";
import type { Flow, DataFlow } from "./Flow.js";
import type { DirectiveKind, MessageDirective, MessagingDirective, MessagingTarget } from "application/ports/MessagingDirective.js";
import type { AdapterKind, MessagingPort } from "application/ports/MessagingPort.js";
import type { Logger } from "infra/Logger.js";
import type { GameStore } from "application/context/modules/GameStore.js";
import type { UserStore } from "application/context/modules/UserStore.js";
import type { View } from "./View.js";
import type { LgonId } from "types/LgonId.js";

export class FlowRunner
{
	public readonly viewStore: ViewStore;
	// private readonly updateOn: Map<LgonId<"">, LgonId<"view">[]>

	constructor(readonly messengers: Record<AdapterKind, MessagingPort>,
				gameStore: GameStore,
				userStore: UserStore,
				readonly logger: Logger)
	{
		this.viewStore = new ViewStore(gameStore, userStore,this.logger);
	}

	public	register(kind: AdapterKind, id: LgonId<"adapter">, rsc: any)
	{
		this.messengers[kind].register(id, rsc);
	}

	async run(directive: MessagingDirective<DataFlow, DirectiveKind>): Promise<void>
	{
		let views: View<DataFlow>[];

		if ( directive.target.kind in ["send", "reply", "dm"] )
		
		if (directive.msg.kind === "flow")
			views = this.viewStore.fromFlow(directive);
		else
			views = [ this.viewStore.fromScript(directive) ];
	}
}
