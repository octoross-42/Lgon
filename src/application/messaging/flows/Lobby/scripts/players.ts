import type { GameStore } from "application/context/modules/GameStore.js";
import { UserStore } from "application/context/modules/UserStore.js";
import type { Game } from "core/game/entities/Game/Game.js";
import type { LgonUser } from "core/game/entities/LgonUser/LgonUser.js";
import type { Logger } from "infra/Logger.js";
import { Script, ScriptMaker, type MessageScript } from "application/messaging/model/Script.js";
import { makeLgonId, type LgonId } from "types/LgonId.js";

export class LobbyPlayersScriptMaker implements ScriptMaker
{
	constructor(private readonly gameStore: GameStore,
				private readonly userStore: UserStore,
				private readonly logger: Logger ) {}

	public script(authorId: LgonId<"user">): Script
	{
		const user: LgonUser | undefined = this.userStore.get(authorId);
		if ( !user )
		{
			this.logger.event( { code : "NOT_FOUND", data: { what: "user", whatId: authorId, ctx: "lobby players script maker making" } } );
			throw Error(""); // TODO
		}

		let gameId: LgonId<"game">;
		if ( !user.game )
			gameId = makeLgonId<"game">("game", "null");
		else
			gameId = user.game.meta.id;

		return (new LobbyPlayersScript(gameId, this.gameStore))
	}
}

export class LobbyPlayersScript implements Script
{
	constructor(private readonly gameId: LgonId<"game">,
				private readonly gameStore: GameStore) {}

	make(): MessageScript
	{
		const game: Game | undefined = this.gameStore.get(this.gameId);
		if ( !game )
			return ({
				title: "Players",
					fields: [
						{
							name: "",
							value: "Game not found"
						}
					]
			});

		const playersIds: string[] = game.players.getIds();
		const playersStr: string = ((playersIds.length > 0) ? "- <@" : "") + playersIds.join(">\n- <@") + ((playersIds.length > 0) ? ">" : "");
		
		return ({
			title: "Players",
			description: `*\`${this.gameId}\`*`,
			fields: [
				{
					name: "",
					value: playersStr
				}
			]
		});
	}
}
