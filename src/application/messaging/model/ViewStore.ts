import type { LgonUser } from "core/game/entities/LgonUser/LgonUser.js";
import type { Flow, MessageBlock, MessageDefinition, ModeDefinition, FlowData, FlowContext, FlowDataGame } from "./Flow.js";
import type { View, ButtonView, SelectView} from "./View.js";
import type { Logger } from "infra/Logger.js";
import { makeLgonId, type LgonId } from "types/LgonId.js";
import type { MessagingTarget } from "application/ports/MessagingPort.js";
import type { GameStore } from "application/context/modules/GameStore.js";
import type { UserStore } from "application/context/modules/UserStore.js";

type ViewSendChange =
{
	kind: "send" | "edit",
	msgId: string, // soit on reply soit on edit
	view: View<FlowData>
}

type ViewDeleteChange =
{
	kind: "delete",
	msgId: string,
}

export type ViewChange = ViewSendChange | ViewDeleteChange;

export class ViewStore
{
	private views: Map<string, View<any>>;
	static n: number = 0;
	private min: number;

	constructor(gameStore: GameStore, userStore: UserStore, private readonly logger: Logger)
	{
		this.views = new Map<string, View<FlowData>>();
		this.min = 0;
	}

	static makeViewId(): LgonId<"view">
	{
		const id: LgonId<"view"> = makeLgonId("view", this.n.toString());
		this.n ++;
		return (id);
	}

	private otherModes<T extends FlowData>(modes: ModeDefinition<T>[], mode: string)
	{
		let otherModes: string[] = [];
		let i: number = 0;
		while (i < modes.length)
		{
			if (modes[i].mode != mode)
				otherModes.push(modes[i].mode);
			i ++;
		}
		return (otherModes);
	}


	compactView<T extends FlowData>(msgBlock: MessageBlock<T>, ctx: FlowContext<T>): View<T>
	{
		const step: MessageDefinition<T> = msgBlock.steps[0];

		const mode: ModeDefinition<T> | undefined = step.modes.find(mode => mode.mode === step.defaultMode);
		if ( !mode )
			throw Error(""); // TODO


		const view: View<T> = {
			id: ViewStore.makeViewId(),
			script: mode.script,
			interactions: mode.interactions.map( row => row.map(interaction => {
					if (interaction.kind === 'button')
					return { model: interaction, enabled: true } as ButtonView<T>
				else
					return { model: interaction, enabled: true, selected: [] } as SelectView<T>
				}) ),
			otherModes: this.otherModes(step.modes, step.defaultMode),
			currentMode: step.defaultMode,
			step: 0,
			target: ctx.originMsgTarget,

			flowData: ctx
		};

		this.views.set(view.id, view);
		return (view);
	}

	longViews<T extends FlowData>(msgBlock: MessageBlock<T>, ctx: FlowContext<T>): View<T>[]
	{
		let views: View<T>[] = [];

		let i: number = 0;
		while (i < msgBlock.steps.length)
		{
			const step: MessageDefinition<T> = msgBlock.steps[i];
			const mode: ModeDefinition<T> | undefined = step.modes.find(mode => mode.mode === step.defaultMode);
			if ( !mode )
				throw Error(""); // TODO

			const target: MessagingTarget =
				(i === 0) ? ctx.originMsgTarget:
				{
					kind: "view",
					viewId: views[i - 1].id
				}; 
				const view: View<T> = {
					id: ViewStore.makeViewId(),
					script: mode.script,
					interactions: mode.interactions.map( row => row.map(interaction => {
						if (interaction.kind === 'button')
							return { model: interaction, enabled: true } as ButtonView<T>
						else
							return { model: interaction, enabled: true, selected: [] } as SelectView<T>
					}) ),
					otherModes: this.otherModes(step.modes, step.defaultMode),
					currentMode: step.defaultMode,
					step: 0,
					target: target,
					
					flowData: ctx
				};

				this.views.set(view.id, view);
				views.push(view);

			i ++;
		}
		return (views);
	}

	new<T extends FlowData>(flow: Flow<T>, author: LgonUser, originMsgTarget: MessagingTarget, flowData: T): View<T>[]
	{
		let views: View<T>[] = [];

		for (const msgBlock of flow)
		{
			const stepMode: "compact" | "long" = author.preferences.stepMode;
			const flowCtx: FlowContext<T> =
			{
				authorId: author.id,
				stepMode: stepMode,
				step: 0,
				originMsgTarget: originMsgTarget,
				data: flowData
			}

			if (stepMode === "compact")
				views.push( this.compactView<T>( msgBlock, flowCtx ) );
			else // "long"
				views.concat( this.longViews<T>( msgBlock, flowCtx ) );

		}
		return (views);
	}

	public get<T extends FlowData>(viewId: LgonId<"view">): View<T> | undefined
	{
		return ( this.views.get(viewId) as View<T>);
	}
};
