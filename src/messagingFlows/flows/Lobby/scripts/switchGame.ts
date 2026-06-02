import type { GameStore } from "application/context/modules/GameStore.js";
import { UserStore } from "application/context/modules/UserStore.js";
import type { Game } from "core/game/entities/Game/Game.js";
import type { LgonUser } from "core/game/entities/LgonUser/LgonUser.js";
import type { Logger } from "infra/Logger.js";
import { Script, ScriptMaker, type MessageScript } from "messagingFlows/model/Script.js";
import { makeLgonId, type LgonId } from "types/LgonId.js";

export class SwitchGameScriptMaker implements ScriptMaker
{
	constructor(private readonly gameStore: GameStore,
				private readonly userStore: UserStore,
				private readonly logger: Logger ) {}

	public script(authorId: LgonId<"user">): Script
	{
		const user: LgonUser | undefined = this.userStore.get(authorId);
		if ( !user )
		{
			this.logger.event( { code : "NOT_FOUND", data: { what: "user", whatId: authorId, ctx: "switch game script maker making" } } );
			throw Error(""); // TODO
		}

		let gameId: LgonId<"game">;
		if ( !user.game )
			gameId = makeLgonId<"game">("game", "null");
		else
			gameId = user.game.meta.id;

		return (new SwitchGameScript(user.id, gameId, this.gameStore, this.userStore, this.logger))
	}
}

export class SwitchGameScript implements Script
{
	constructor(private readonly userId: LgonId<"user">,
				private readonly switchToId: LgonId<"game">,
				private readonly gameStore: GameStore,
				private readonly userStore: UserStore,
				public readonly logger: Logger) {}

	make(): MessageScript
	{
		const game: Game | undefined = this.gameStore.get(this.switchToId);
		if ( !game )
			return ({
				title: "Switch Game",
					fields: [
						{
							name: "",
							value: "Game to switch not found"
						}
					]
			});

		
		const user: LgonUser | undefined = this.userStore.get(this.userId);
		if ( !user )
		{
			return ({
				title: "Switch Game",
				fields: [
					{
						name: "",
						value: "User not found"
					}
				]
			});
		}

		return ({
			title: "Switch Game",
			fields: [
				{
					name: "\u200b",
					value: `Do you want to switch game ?\n*From ${(user.game)? user.game.meta.id: "null"} to ${this.switchToId}*`
				}
			]
		});
	}
}
