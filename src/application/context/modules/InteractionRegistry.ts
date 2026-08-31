import type { Logger } from "infra/Logger.js";
import type { ButtonId, SelectId } from "application/messaging/loadInteractions.js";
import type { ButtonHandler, SelectHandler } from "application/messaging/model/InteractionHandler.js";
import { LgonId } from "types/LgonId.js";
import type { InteractionCode } from "application/errors/InteractionError.js";

export interface Usecase
{
	run(...args: any): Promise<void> | void;
}

export class InteractionRegistry
{
	constructor(private readonly buttons: Record<ButtonId, ButtonHandler>,
				private readonly selects: Record<SelectId, SelectHandler>,
				private readonly logger: Logger) {}

	has(interactionId: string): boolean
	{
		return ( interactionId in this.buttons || interactionId in this.selects );
	}

	async button(interactionId: ButtonId, authorId: LgonId<"user">, msgCtxId: string): Promise<InteractionCode>
	{
		this.logger.event( { code: "BUTTON", data: { userId: authorId, interactionId: interactionId } } );
		return (await this.buttons[interactionId].run(authorId, msgCtxId));
	}

	async select(interactionId: SelectId, interactionName: string, authorId: LgonId<"user">, selected: string[], viewId: LgonId<"view">): Promise<InteractionCode>
	{
		this.logger.event( { code: "SELECT", data: { userId: authorId, interactionId: interactionId, interactionName: interactionName } } );
		return (await this.selects[interactionId].run(authorId, selected, interactionName, viewId));
	}
}
