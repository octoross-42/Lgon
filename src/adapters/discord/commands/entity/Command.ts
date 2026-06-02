import type { LgonContext } from "application/context/LgonContext.js";
import type { CommandMeta } from "./CommandMeta.js";
import type { Message } from "discord.js";
import { DiscordMessagingCache } from "adapters/discord/store/DiscordMessagingCache.js";
import { Logger } from "infra/Logger.js";

export abstract class Command
{
	constructor(
		public readonly meta : CommandMeta,
		protected readonly msgsCache: DiscordMessagingCache,
		protected readonly logger: Logger){}

	
	public abstract run(lgon: LgonContext, message: Message, argv: string[]): Promise<void> | void

	getMainCategory(): string
	{
		if (this.meta.category.length > 0)
			return (this.meta.category[0]);
		return ("");
	}
}
