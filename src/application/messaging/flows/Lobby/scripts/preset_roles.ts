import type { GameStore } from "application/context/modules/GameStore.js";
import { UserStore } from "application/context/modules/UserStore.js";
import type { Game } from "core/game/entities/Game/Game.js";
import type { RoleStock } from "core/game/entities/Game/modules/PickedRoleRegistry.js";
import type { LgonUser } from "core/game/entities/LgonUser/LgonUser.js";
import type { Logger } from "infra/Logger.js";
import { Script, ScriptMaker, type MessageScript } from "messagingFlows/model/Script.js";
import { makeLgonId, type LgonId } from "types/LgonId.js";

export class LobbyPresetRolesScriptMaker implements ScriptMaker
{
	constructor(private readonly gameStore: GameStore,
				private readonly userStore: UserStore,
				private readonly logger: Logger ) {}

	public script(authorId: LgonId<"user">): Script
	{
		const user: LgonUser | undefined = this.userStore.get(authorId);
		if ( !user )
		{
			this.logger.event( { code : "NOT_FOUND", data: { what: "user", whatId: authorId, ctx: "lobby roles script maker making" } } );
			throw Error(""); // TODO
		}

		let gameId: LgonId<"game">;
		if ( !user.game )
			gameId = makeLgonId<"game">("game", "null");
		else
			gameId = user.game.meta.id;

		return (new LobbyPresetRolesScript(gameId, this.gameStore))
	}
}

export class LobbyPresetRolesScript implements Script
{
	constructor(private readonly gameId: LgonId<"game">,
				private readonly gameStore: GameStore) {}

	make(): MessageScript
	{
		const game: Game | undefined = this.gameStore.get(this.gameId);
		if ( !game )
			return ({
				title: "Roles",
					fields: [
						{
							name: "",
							value: "Game not found"
						}
					]
			});

		const stocks: RoleStock[] = game.pickedRoles.getStock();
		const rolesStr: string = (stocks.length > 0) ? ("- " + stocks.map( stock => stock.gen.printName ).join("\n- ")): "*__*";
		const countStr: string = (stocks.length > 0) ? (stocks.map( stock => stock.qty.toString() ).join("\n")) : "0";
		
		return ({
			title: "Roles",
			description: `*\`${this.gameId}\`*`,
			fields: [
				{
					name: "Role",
					value: rolesStr
				},
				{
					name: "Count",
					value: countStr
				}
			]
		});
	}
}
