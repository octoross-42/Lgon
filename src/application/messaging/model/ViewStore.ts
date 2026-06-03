import type { LgonUser } from "core/game/entities/LgonUser/LgonUser.js";
import type { Flow, MessageBlock, MessageDefinition, ModeDefinition } from "./Flow.js";
import type { MessageView, MsgBlockCtx, ButtonView, SelectView } from "./View.js";
import type { Logger } from "infra/Logger.js";
import { makeLgonId, type LgonId } from "types/LgonId.js";
import type { MessagingTarget } from "application/ports/MessagingPort.js";
import type { ScriptMaker, Script } from "./Script.js";
import { loadScripts, type ScriptName } from "messagingFlows/loadScripts.js";
import type { GameStore } from "application/context/modules/GameStore.js";
import type { UserStore } from "application/context/modules/UserStore.js";

type ViewSendChange =
{
	kind: "send" | "edit",
	msgId: string, // soit on reply soit on edit
	view: MessageView
}

type ViewDeleteChange =
{
	kind: "delete",
	msgId: string,
}

export type ViewChange = ViewSendChange | ViewDeleteChange;

export class ViewStore
{
	private views: Map<string, MessageView>;
	static n: number = 0;
	private min: number;
	private scripts: Record<ScriptName, ScriptMaker>

	constructor(gameStore: GameStore, userStore: UserStore, private readonly logger: Logger)
	{
		this.views = new Map<string, MessageView>();
		this.min = 0;
		this.scripts = loadScripts(gameStore, userStore, logger);
	}

	static makeViewId(): LgonId<"view">
	{
		const id: LgonId<"view"> = makeLgonId("view", this.n.toString());
		this.n ++;
		return (id);
	}

	private otherModes(modes: ModeDefinition[], mode: string)
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

	private getScript(scriptName: ScriptName, authorId: LgonId<"user">): Script
	{
		return (this.scripts[scriptName].script(authorId));
	}

	compactView(msgBlock: MessageBlock, ctx: MsgBlockCtx): MessageView
	{
		const step: MessageDefinition = msgBlock.steps[0];

		const mode: ModeDefinition | undefined = step.modes.find(mode => mode.mode === step.defaultMode);
		if ( !mode )
			throw Error(""); // TODO

		const script: Script | undefined = this.getScript(mode.script, ctx.authorId);
		if ( !script )
			throw Error(""); // TODO

		const view: MessageView = {
			id: ViewStore.makeViewId(),
			script: script,
			interactions: mode.interactions.map( row => row.map(interaction => {
					if (interaction.kind === 'button')
					return { model: interaction, enabled: true } as ButtonView
				else
					return { model: interaction, enabled: true, selected: [] } as SelectView
				}) ),
			otherModes: this.otherModes(step.modes, step.defaultMode),
			currentMode: step.defaultMode,
			step: 0,
			target: ctx.originMsgTarget,

			blockCtx: ctx
		};

		this.views.set(view.id, view);
		return (view);
	}

	longViews(msgBlock: MessageBlock, ctx: MsgBlockCtx): MessageView[]
	{
		let views: MessageView[] = [];

		let i: number = 0;
		while (i < msgBlock.steps.length)
		{
			const step: MessageDefinition = msgBlock.steps[i];
			const mode: ModeDefinition | undefined = step.modes.find(mode => mode.mode === step.defaultMode);
			if ( !mode )
				throw Error(""); // TODO

			const script: Script | undefined = this.getScript(mode.script, ctx.authorId);
			if ( !script )
				throw Error(""); // TODO

			const target: MessagingTarget =
				(i === 0) ? ctx.originMsgTarget:
				{
					kind: "reply",
					viewId: views[i - 1].id
				}; 
				const view: MessageView = {
					id: ViewStore.makeViewId(),
					script: script,
					interactions: mode.interactions.map( row => row.map(interaction => {
						if (interaction.kind === 'button')
							return { model: interaction, enabled: true } as ButtonView
						else
							return { model: interaction, enabled: true, selected: [] } as SelectView
					}) ),
					otherModes: this.otherModes(step.modes, step.defaultMode),
					currentMode: step.defaultMode,
					step: 0,
					target: target,
					
					blockCtx: ctx
				};

				this.views.set(view.id, view);
				views.push(view);

			i ++;
		}

		return (views);

	}

	new(flow: Flow, author: LgonUser, originMsgTarget: MessagingTarget): MessageView[]
	{
		let views: MessageView[] = [];

		for (const msgBlock of flow)
		{
			const stepMode: "compact" | "long" = author.preferences.stepMode;
			const blockCtx: MsgBlockCtx =
			{
				authorId: author.id,
				stepMode: stepMode,
				step: 0,
				originMsgTarget: originMsgTarget
			}

			if (stepMode === "compact")
				views.push( this.compactView( msgBlock, blockCtx ) );
			else // "long"
				views.concat( this.longViews( msgBlock, blockCtx ) );

		}
		return (views);
	}
};
