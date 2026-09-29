import type { ButtonId, SelectId } from "../loadInteractions.js";
import type { Script } from "./View.js";

import type { GameStore } from "application/context/modules/GameStore.js";
import type { Logger } from "infra/Logger.js";
import type { UserStore } from "application/context/modules/UserStore.js";
import type { LgonId } from "types/LgonId.js";
import type { StepMode } from "core/game/entities/LgonUser/UserPreferences.js";

export type GameDataFlow =
{
	gameId: LgonId<"game">,
	gameStore: GameStore,
	logger: Logger
}

export type SwitchGameDataFlow =
{
	userId: LgonId<"user">,
	userStore: UserStore,
	gameStore: GameStore,
	logger: Logger
}

export type DataFlow = GameDataFlow | SwitchGameDataFlow | undefined;

export type FlowContext<DataFlow> =
{
	authorId: LgonId<"user">,
	stepMode: StepMode,
	step: number,
	// originMsgTarget: MessagingTarget,
	data: DataFlow
}


export type InteractionKind = "button" | "select";
export type LgonButtonStyle = "blue" | "red" | "green" | "grey" | "link";

export type ButtonBuild<T extends DataFlow> =
{
	label: string,
	style: LgonButtonStyle,
	enabled: (ctx: FlowContext<T>) => boolean
};

export type SelectOption = { label: string; value: string; description?: string, default?: boolean };

export type SelectBuild<T extends DataFlow> =
{
	placeholder: string,
	options: (ctx: FlowContext<T>) => SelectOption[],
	minValues: number,
	maxValues: number,
	enabled: (ctx: FlowContext<T>) => boolean
};

export type InteractionIdKind = "game" | "user";

export type ButtonInteractionModel<T extends DataFlow> =
{
	kind: "button",
	build: ButtonBuild<T>,
	id: ButtonId
}

export type SelectInteractionModel<T extends DataFlow> =
{
	kind: "select",
	build: SelectBuild<T>,
	id: SelectId,
	name: string
}

export type InteractionModel<T extends DataFlow> = ButtonInteractionModel<T> | SelectInteractionModel<T>;

export type ModeDefinition<T extends DataFlow> =
{
	mode: string,
	script: (ctx: FlowContext<T>) => Script,
	interactions: InteractionModel<T>[][]
}

export type MessageDefinition<T extends DataFlow> =
{
	modes: ModeDefinition<T>[];
	defaultMode: string;
};

export type MessageBlock<T extends DataFlow> =
{
	id: string;
	steps: MessageDefinition<T>[];
}

export type Flow<T extends DataFlow> = MessageBlock<T>[];
