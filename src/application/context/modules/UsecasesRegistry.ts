import type { DataFlow } from "application/messaging/model/Flow.js";
import type { AnyMessagingDirective } from "application/ports/MessagingDirective.js";
import type { Logger } from "infra/Logger.js";
import { LgonId } from "types/LgonId.js";

export interface Usecase
{
	run(...args: any): Promise<AnyMessagingDirective<DataFlow>[]> | AnyMessagingDirective<DataFlow>[];
}

export class UsecasesRegistry
{
	constructor(private readonly usecases: Record<string, Usecase>,
				private readonly logger: Logger){}

	run(usecaseName: string, authorId: LgonId<"user">, ...args: any): Promise<AnyMessagingDirective<DataFlow>[]> | AnyMessagingDirective<DataFlow>[]
	{
		this.logger.event( { code: "USECASE", data: { userId: authorId ,command: usecaseName } } );
		return (this.usecases[usecaseName].run(authorId, ...args));
	}
}
