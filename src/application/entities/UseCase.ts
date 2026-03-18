import type { LgonContext } from "../context/LgonContext.js";
import type { MessagingPort } from "../ports/MessagingPort.js";
import type { Logger } from "../../infra/Logger.js";
import type { LgonId } from "../../types/LgonId.js";
import { LgonUser } from "../../domain/game/entities/LgonUser/LgonUser.js";

export abstract class UseCase
{
	constructor(private readonly lgon: LgonContext,
			private readonly messagingPort: MessagingPort,
			private readonly logger: Logger) {}

	run(args: any)
	{
		// this.logger.newSession(); // TODO
		this.runUseCase(args);
		// this.logger.endSession();

	}

	abstract runUseCase(args: any): void
}