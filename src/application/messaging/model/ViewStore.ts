import type { MessageBlock, MessageDefinition, ModeDefinition, DataFlow, FlowContext, GameDataFlow } from "./Flow.js";
import type { View, ButtonView, SelectView} from "./View.js";
import type { Logger } from "infra/Logger.js";
import { getLgonId, makeLgonId, type LgonId } from "types/LgonId.js";
import type { GameStore } from "application/context/modules/GameStore.js";
import type { UserStore } from "application/context/modules/UserStore.js";
import { DEFAULT_STEPMODE, type StepMode } from "core/game/entities/LgonUser/UserPreferences.js";
import { MessagingDirective, MessagingTarget } from "application/ports/MessagingDirective.js";
import { LGONID } from "constants.js";

type ViewSendChange =
{
	kind: "send" | "edit",
	msgId: string, // soit on reply soit on edit
	view: View<DataFlow>
}

type ViewDeleteChange =
{
	kind: "delete",
	msgId: string,
}

export type UserViewCtx =
{
	stepMode: StepMode,
	userId: LgonId<"user">
}

type ViewOptions<T extends DataFlow> =
{
	msgBlock: MessageBlock<T>,
	ctx: FlowContext<T>,
	target: MessagingTarget
}

export type ViewChange = ViewSendChange | ViewDeleteChange;

export class ViewStore
{
	private views: Map<string, View<any>>;
	static n: number = 0;
	private min: number;

	constructor(gameStore: GameStore, userStore: UserStore, private readonly logger: Logger)
	{
		this.views = new Map<string, View<DataFlow>>();
		this.min = 0;
	}

	static makeViewId(): LgonId<"view">
	{
		const id: LgonId<"view"> = makeLgonId("view", this.n.toString());
		this.n ++;
		return (id);
	}

	private otherModes<T extends DataFlow>(modes: ModeDefinition<T>[], mode: string)
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

	private compactView<T extends DataFlow>(viewOption: ViewOptions<T>): View<T>
	{
		const step: MessageDefinition<T> = viewOption.msgBlock.steps[0];

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
			target: viewOption.target,
			flowData: viewOption.ctx
		};

		this.views.set(view.id, view);
		return (view);
	}

	private longViews<T extends DataFlow>(viewOption: ViewOptions<T>): View<T>[]
	{
		let views: View<T>[] = [];

		let i: number = 0;
		while (i < viewOption.msgBlock.steps.length)
		{
			const step: MessageDefinition<T> = viewOption.msgBlock.steps[i];
			const mode: ModeDefinition<T> | undefined = step.modes.find(mode => mode.mode === step.defaultMode);
			if ( !mode )
				throw Error(""); // TODO

			const target: MessagingTarget =
				(i === 0) ? viewOption.target:
				{
					kind: "reply",
					targetId: makeLgonId("adapter", getLgonId(views[i - 1].id)),
					adapter: "discord",
					originAdapter: "discord"
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
					flowData: viewOption.ctx
				};

				this.views.set(view.id, view);
				views.push(view);

			i ++;
		}
		return (views);
	}

	public fromFlow(directive: MessagingDirective<DataFlow, "flow">): View<DataFlow>[]
	{
		let views: View<DataFlow>[] = [];

		for (const msgBlock of directive.msg.flow)
		{
			const stepMode: StepMode = directive.msg.userCtx.stepMode;
			const flowCtx: FlowContext<DataFlow> =
			{
				authorId: directive.msg.userCtx.userId,
				stepMode: stepMode,
				step: 0,
				data: directive.msg.data
			}

			if (stepMode === "compact")
				views.push( this.compactView( { msgBlock: msgBlock, ctx: flowCtx, target: directive.target } ) );
			else // "long"
				views.concat( this.longViews( { msgBlock: msgBlock, ctx: flowCtx, target: directive.target } ) );

		}
		return (views);
	}

	public fromScript(directive: MessagingDirective<DataFlow, "simple">): View<DataFlow>
	{
		return ({
			id: ViewStore.makeViewId(),
			script: () => directive.msg.script,
			interactions: [],
			otherModes: [],
			currentMode: "default",
			step: 0,
			target: directive.target,
			flowData: {
				authorId: LGONID,
				stepMode: DEFAULT_STEPMODE,
				step: 0,
				data: undefined
			}
		});
	}

	public get<T extends DataFlow>(viewId: LgonId<"view">): View<T> | undefined
	{
		return ( this.views.get(viewId) as View<T>);
	}
};
