import type { Logger } from "infra/Logger.js";
import type { ButtonName, SelectName } from "application/messaging/loadInteractions.js";
import type { ButtonHandler, InteractionHandler, SelectHandler } from "application/messaging/model/InteractionHandler.js";
import { LgonId } from "types/LgonId.js";

export interface Usecase
{
	run(...args: any): Promise<void> | void;
}

export class InteractionRegistry
{
	constructor(private readonly buttons: Record<ButtonName, ButtonHandler>,
				private readonly selects: Record<SelectName, SelectHandler>,
				private readonly logger: Logger) {}

	has(interactionName: string): boolean
	{
		return ( interactionName in this.buttons || interactionName in this.selects );
	}

	async button(interactionName: ButtonName, authorId: LgonId<"user">, contextId: string): Promise<void>
	{
		this.logger.event( { code: "INTERACTION", data: { userId: authorId, interaction: interactionName } } );
		await this.buttons[interactionName].run(authorId, contextId);
	}

	async select(interactionName: SelectName, authorId: LgonId<"user">, selected: string[], contextId: string): Promise<void>
	{
		this.logger.event( { code: "INTERACTION", data: { userId: authorId, interaction: interactionName } } );
		await this.selects[interactionName].run(authorId, selected, contextId);
	}
}
