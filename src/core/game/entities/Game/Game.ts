import { GameMeta } from "./GameMeta.js";
import { PlayerRegistry } from "./modules/Players/PlayerRegistry.js";
import { PickedRoleRegistry } from "./modules/PickedRoleRegistry.js";
import type { LgonUser } from "../LgonUser/LgonUser.js";
import type { Logger } from "infra/Logger.js";
import type { LgonRoleGeneratorRegistry } from "application/context/modules/LgonRoleGeneratorRegistry.js";
import { LgonId, makeLgonId } from "types/LgonId.js";

export class Game
{
	meta: GameMeta;
	
	phase: "setup" | "night" | "day" | "voting" | "ended";
	public players: PlayerRegistry;
	public pickedRoles: PickedRoleRegistry;
	
	constructor(availableRoles: LgonRoleGeneratorRegistry,
				public readonly logger: Logger)
	{
		// TODO GERER LES OVERFLOW D'ids -> quand on reach 1 000 000

		this.meta = new GameMeta();
		this.pickedRoles = new PickedRoleRegistry(availableRoles, this.logger);
		this.phase = "setup";
		this.players = new PlayerRegistry(this);
	}

	join(user: LgonUser)
	{
		this.players.join(user);
	}

	public add_roles(rolesNames: LgonId<"role">[], count: number): boolean
	{
		return (this.pickedRoles.add(rolesNames, count));
	}

	// async distributeRoles(bot: Client): Promise<void>
	// {
	// 	this.playersRoles = [];
	// 	let rolesOrder: string[] = CONSTANTES.ROLES_ORDER;

	// 	let i: number = 0;
	// 	let roleId: number = 0;
	// 	let tmpPlayers: Player[] = Array.from(this.players.values());
	// 	let tmpCenter: string[] = [ "left", "middle", "right"];
	// 	this.center = new Map<string, NightRole>();
	// 	while (i < rolesOrder.length)
	// 	{
	// 		const role: string = rolesOrder[i].toLowerCase();
	// 		if (this.roles.has(role))
	// 		{
	// 			const roleCount: number = this.roles.get(role)!;
	// 			const roleGen: RoleGenerator = bot.roles.get(role)!;
	// 			let j: number = 0;
	// 			while (j < roleCount)
	// 			{
	// 				let lgonRole: NightRole;
	// 				if ( (Math.floor(Math.random() * (this.rolesCount)) < tmpCenter.length) || (tmpPlayers.length === 0))
	// 				{
	// 					const index: number = Math.floor(Math.random() * tmpCenter.length);
	// 					lgonRole = roleGen.generateRole(tmpCenter[index], roleId);
	// 					this.center.set(tmpCenter[index], lgonRole);
	// 					tmpCenter.splice(index, 1);
	// 				}
	// 				else
	// 				{
	// 					const index: number = Math.floor(Math.random() * tmpPlayers.length);
	// 					lgonRole = roleGen.generateRole(tmpPlayers[index], roleId);
	// 					// let lgonNightyRole: NightRole = roleGen.generateRole(tmpPlayers[index], roleId);
	// 					await tmpPlayers[index].sendRole(lgonRole);
	// 					tmpPlayers.splice(index, 1);
	// 				}
	// 				this.playersRoles.push(lgonRole);
	// 				j ++;
	// 				roleId ++;
	// 			}
	// 		}
	// 		i ++;
	// 	}
	// }

	canStart(): boolean
	{
		if (this.phase !== "setup")
			return (false);

		const playersCount = this.players.size();
		return ((this.players.ready())) // && (playersCount + 3 === this.roles.size())
			// && (playersCount >= CONSTANTES.MIN_NBR_PLAYERS));
	}

	start(): void
	{
	}

}
