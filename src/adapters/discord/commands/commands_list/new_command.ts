import type { Message } from "discord.js";
import type { CommandMeta } from "../entity/CommandMeta.js";
import { Command } from "../entity/Command.js";
import type { LgonContext } from "application/context/LgonContext.js";
import { LgonId, makeLgonId } from "types/LgonId.js";
import type { DiscordMessagingCache } from "adapters/discord/store/DiscordMessagingCache.js";
import { Logger } from "infra/Logger.js";
import type { AnyMessagingRequest, MessagingSource } from "application/ports/MessagingDirective.js";
import type { DataFlow } from "application/messaging/model/Flow.js";
import { AdapterKind } from "application/ports/MessagingPort.js";

const meta: CommandMeta =
{
	name : "new",
	description : {
		"fr": "Créé une nouvelle partie panels (si le joueur peut) et répond avec les paneaux du jeu (controles, recap des joueurs, selection des roles)",
		"eng": "Creates a new game (if player can) and reply with the game panels (controls, players recap, roles selection)",
	},
	nbrArgsRequired : 0,
	cooldown: 2,
	where: "guild",
	aliases: new Set<string>( [ "newGame", "create", "createGame" ] ), 
	usage : "lgon new",
	category: []
};

export class CreateGameCommand extends Command
{
	constructor(msgsCache: DiscordMessagingCache,
				logger: Logger)
	{
		super(meta, msgsCache, logger);
	}


	async run(lgon: LgonContext, message: Message, argv: string[]): Promise<void>
	{
		const msgSource: MessagingSource<AdapterKind> = {
			adapterId: makeLgonId("adapter", message.id),
			adapter: "discord",
			kind: "message"
		};
		
		const messagingRequests: AnyMessagingRequest<DataFlow>[] = await lgon.usecases.run("CreateGame", makeLgonId<"user">("user", message.author.id), msgSource, message.author.avatar);
	
		
	}
}
