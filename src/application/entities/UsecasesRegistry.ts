import type { LgonContext } from "../context/LgonContext.js";
import type { MessagingPort } from "../ports/MessagingPort.js";
import type { Logger } from "infra/Logger.js";

export abstract class Usecase
{
    constructor( protected registry: UsecasesRegistry) {}

	abstract run(args: any): void
}

export abstract class UsecasesRegistry
{
	private usecases: Record<string, Usecase>;

	constructor(public readonly lgon: LgonContext,
			public readonly messagingPort: MessagingPort,
			public readonly logger: Logger)
	{
		this.usecases = {};
	}

	run(usecaseName: string, args: any)
	{
		// this.logger.newSession(); // TODO

		this.usecases[usecaseName].run(args);

		// this.logger.endSession();

	}

}