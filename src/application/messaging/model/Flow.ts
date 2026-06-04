import type { ButtonName, SelectName } from "../loadInteractions.js";
import type { Script } from "./View.js";

import type { GameStore } from "application/context/modules/GameStore.js";
import type { Logger } from "infra/Logger.js";
import type { UserStore } from "application/context/modules/UserStore.js";
import type { LgonId } from "types/LgonId.js";
import type { MessagingTarget } from "application/ports/MessagingPort.js";

export type FlowDataGame =
{
	gameId: LgonId<"game">,
	gameStore: GameStore,
	logger: Logger
}

export type FlowDataSwitchGame =
{
	userId: LgonId<"user">,
	userStore: UserStore,
	gameStore: GameStore,
	logger: Logger
}

export type FlowData = FlowDataGame | FlowDataSwitchGame | undefined;

export type FlowContext<FlowData> =
{
	authorId: LgonId<"user">,
	stepMode: "compact" | "long",
	step: number,
	originMsgTarget: MessagingTarget,
	data: FlowData
}


export type InteractionKind = "button" | "select";
export type LgonButtonStyle = "blue" | "red" | "green" | "grey" | "link";

export type ButtonBuild<T extends FlowData> =
{
	label: string,
	style: LgonButtonStyle,
	enabled: (ctx: FlowContext<T>) => boolean
};

export type SelectOption = { label: string; value: string; description?: string, default?: boolean };

export type SelectBuild<T extends FlowData> =
{
	placeholder: string,
	options: (ctx: FlowContext<T>) => SelectOption[],
	minValues: number,
	maxValues: number,
	enabled: (ctx: FlowContext<T>) => boolean
};

export type InteractionIdKind = "game" | "user";

export type ButtonInteractionModel<T extends FlowData> =
{
	kind: "button",
	build: ButtonBuild<T>,
	interactionId: ButtonName,
	id: string
}

export type SelectInteractionModel<T extends FlowData> =
{
	kind: "select",
	build: SelectBuild<T>,
	interactionId: SelectName,
	id: string
}

export type InteractionModel<T extends FlowData> = ButtonInteractionModel<T> | SelectInteractionModel<T>;

export type ModeDefinition<T extends FlowData> =
{
	mode: string,
	script: (ctx: FlowContext<T>) => Script,
	interactions: InteractionModel<T>[][]
}

export type MessageDefinition<T extends FlowData> =
{
	modes: ModeDefinition<T>[];
	defaultMode: string;
};

export type MessageBlock<T extends FlowData> =
{
	id: string;
	steps: MessageDefinition<T>[];
}

export type Flow<T extends FlowData> = MessageBlock<T>[];
