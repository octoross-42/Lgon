import type { MessageScript, Script, ScriptMaker } from "messagingFlows/model/Script.js";
import type { LgonId } from "types/LgonId.js";

export class CannotLeaveScriptMaker implements ScriptMaker
{
	constructor() {}

	public script(authorId: LgonId<"user">): Script
	{
		return (new CannotLeaveScript())
	}
}

export class CannotLeaveScript implements Script
{
	constructor() {}

	make(): MessageScript
	{
		return ({
			title: "\\:(",
			fields: [
				{
					name: "",
					value: "You cannot leave your current game"
				}
			]
		});
	}
}
