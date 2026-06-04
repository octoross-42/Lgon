import type { MessageScript, Script, ScriptMaker } from "application/messaging/model/Script.js";
import type { LgonId } from "types/LgonId.js";

export class InternalErrorScriptMaker implements ScriptMaker
{
	constructor() {}

	public script(authorId: LgonId<"user">): Script
	{
		return (new InternalErrorScript())
	}
}

export class InternalErrorScript implements Script
{
	constructor() {}

	make(): MessageScript
	{
		return ({
			title: "Error \\:(",
			fields: [
				{
					name: "",
					value: "Internal error, please contact the dev"
				}
			]
		});
	}
}
