import { type UserViewCtx, ViewStore } from "./ViewStore.js";
import type { Flow, DataFlow } from "./Flow.js";
import type { MessageDirective, MessageDirectiveKind, MessagingRequest } from "application/ports/MessagingDirective.js";
import type { AdapterKind, AdapterSourceKind, MessagingPort } from "application/ports/MessagingPort.js";
import type { Logger } from "infra/Logger.js";
import type { GameStore } from "application/context/modules/GameStore.js";
import type { UserStore } from "application/context/modules/UserStore.js";
import type { View } from "./View.js";
import type { LgonId } from "types/LgonId.js";

type ViewBinding<A extends AdapterKind> =
{
	viewId: LgonId<"view">,
	adapter: A,
	sourceKind: AdapterSourceKind<A>
};

export class FlowRunner
{
	public readonly viewStore: ViewStore;
	private readonly propertiesDeps: Map<LgonId<"property">, ViewBinding<AdapterKind>>;
	// private readonly adaptersViewIds: Map<LgonId<"adapter">>
	// private readonly updateOn: Map<LgonId<"">, LgonId<"view">[]>

	constructor(readonly messengers: Record<AdapterKind, MessagingPort>,
				gameStore: GameStore,
				userStore: UserStore,
				readonly logger: Logger)
	{
		this.viewStore = new ViewStore(gameStore, userStore,this.logger);
		this.propertiesDeps = new Map<LgonId<"property">, ViewBinding<AdapterKind>>();
	}

	public	register(kind: AdapterKind, id: LgonId<"adapter">, rsc: any)
	{
		this.messengers[kind].register(id, rsc);
	}

	private getViewsFromRequest(msg: MessageDirective<DataFlow, MessageDirectiveKind>): View<DataFlow>[] | undefined
	{
		let views: View<DataFlow>[] | undefined = undefined;

		switch (msg.kind)
		{
			case ("flow"):
				views = this.viewStore.fromFlow(msg);
				break ;
			case ("simple"):
				views = [ this.viewStore.fromScript(msg) ];
				break ;
			case ("view"):
			{

				const view: View<DataFlow> | undefined = this.viewStore.get(msg.viewId);
				if ( !view )
					return (undefined);
				views = [ view ];
			}
		}
		return (views);
	}

	async run(request: MessagingRequest<DataFlow, MessageDirectiveKind>): Promise<void>
	// TODO : factoriser les requests, faire tourner un bus, faire en sorte qu'une requete n'update pas des messages plusieurs fois, puis filtrer les changements toutes les ... ms
	{
		const views: View<DataFlow>[] | undefined = this.getViewsFromRequest(request.msg);
		if ( !views )
			return ;

		this.messengers[request.source.adapter].execute({
			views: views,
			route: { ...request.source,
				intention: request.intention,
				originAdapter: request.source.adapter,
				sourceKind: request.source.kind
			}
		});

		if (request.intention != "auto-update")
			return ;
		
		let toUpdate: ViewBinding<AdapterKind> | undefined;
		let view: View<DataFlow> | undefined;
		request.propagateIds.forEach(propertyId =>
		{
			toUpdate = this.propertiesDeps.get(propertyId);
			if ( !toUpdate )
				return ;

			view = this.viewStore.get(toUpdate.viewId);
			if ( !view )
				return ;
			this.messengers[request.source.adapter].execute({
				views: views,
				route: { ...request.source,
					intention: "auto-update",
					originAdapter: toUpdate.adapter,
					sourceKind: toUpdate.sourceKind
				}
			});
		});
	}
}
