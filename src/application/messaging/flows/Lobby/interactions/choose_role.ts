import type { RoleDescription } from "application/context/modules/LgonRoleGeneratorRegistry.js";
import type { FlowContext, GameDataFlow, SelectOption } from "application/messaging/model/Flow.js";

export function ChooseRoleOptions(ctx: FlowContext<GameDataFlow>): SelectOption[]
{
	let options: SelectOption[] = [];

	const descriptions: RoleDescription[] = ctx.data.gameStore.availableRoles.getDescriptions();
	for (const description of descriptions)
		options.push( { label: description.name, value: description.id, description: description.description } );

	return (options);
}