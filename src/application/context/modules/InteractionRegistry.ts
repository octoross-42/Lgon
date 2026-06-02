import type { Logger } from "infra/Logger.js";
import type { ButtonName, SelectName } from "messagingFlows/loadInteractions.js";
import type { InteractionReply } from "messagingFlows/model/InteractionReply.js";
import { LgonId } from "types/LgonId.js";

export interface Usecase
{
	run(...args: any): Promise<void> | void;
}

export class InteractionRegistry
{
	constructor(private readonly buttons: Record<ButtonName, InteractionReply>,
				private readonly selects: Record<SelectName, InteractionReply>,
				private readonly logger: Logger) {}

	has(interactionName: string): boolean
	{
		return ( interactionName in this.buttons || interactionName in this.selects );
	}

	button(interactionName: ButtonName, authorId: LgonId<"user">, args: string)
	{
		this.logger.event( { code: "INTERACTIONREPLY", data: { userId: authorId, interaction: interactionName } } );
		this.buttons[interactionName].run(authorId);

	}

	select(interactionName: SelectName, authorId: LgonId<"user">, args: string, selected: string[])
	{
		console.log("select: ", selected);
		this.logger.event( { code: "INTERACTIONREPLY", data: { userId: authorId, interaction: interactionName } } );
		this.selects[interactionName].run(authorId);
	}

}