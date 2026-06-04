import type { MessageScript, Script, ScriptMaker } from "application/messaging/model/Script.js";
import type { LgonId } from "types/LgonId.js";

export class CannotJoinScriptMaker implements ScriptMaker
{
	constructor() {}

	public script(authorId: LgonId<"user">): Script
	{
		return (new CannotJoinScript())
	}
}

export class CannotJoinScript implements Script
{
	constructor() {}

	make(): MessageScript
	{
		return ({
			title: "\\:(",
			fields: [
				{
					name: "",
					value: "You cannot join this game"
				}
			]
		});
	}
}
