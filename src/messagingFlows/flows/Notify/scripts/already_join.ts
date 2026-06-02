import type { MessageScript, Script, ScriptMaker } from "messagingFlows/model/Script.js";
import type { LgonId } from "types/LgonId.js";

export class AlreadyJoinedScriptMaker implements ScriptMaker
{
	constructor() {}

	public script(authorId: LgonId<"user">): Script
	{
		return (new AlreadyJoinedScript())
	}
}

export class AlreadyJoinedScript implements Script
{
	constructor() {}

	make(): MessageScript
	{
		return ({
			title: "\\:(",
			fields: [
				{
					name: "",
					value: "You already joined this game"
				}
			]
		});
	}
}
