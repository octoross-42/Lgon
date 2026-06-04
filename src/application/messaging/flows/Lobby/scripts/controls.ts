import type { UserStore } from "application/context/modules/UserStore.js";
import { Script, ScriptMaker, type MessageScript } from "application/messaging/model/Script.js";
import { makeLgonId, type LgonId } from "types/LgonId.js";

export class LobbyControlsScriptMaker implements ScriptMaker
{
	constructor(private readonly userStore: UserStore) {}

	public script(authorId: LgonId<"user">): Script
	{
		const gameId: LgonId<"game"> | undefined = this.userStore.get(authorId)?.game?.meta.id; // TODO
		return (new LobbyControlsScript(gameId? gameId: makeLgonId<"game">("game", "null")));
	}
}

export class LobbyControlsScript implements Script
{
	constructor(private readonly gameId: LgonId<"game">) {}

	make(): MessageScript
	{
		return ({
			title: "Controls",
			description: `*\`${this.gameId}\`*`,
			fields: [
				{
					name: "",
					value: ""
				}
			]
		});
	}
}
