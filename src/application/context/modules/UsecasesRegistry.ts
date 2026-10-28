import type { DataFlow } from "application/messaging/model/Flow.js";
import type { AnyMessagingRequest, MessagingSource } from "application/ports/MessagingDirective.js";
import type { AdapterKind } from "application/ports/MessagingPort.js";
import type { Logger } from "infra/Logger.js";
import { LgonId } from "types/LgonId.js";

export interface Usecase
{
	run(...args: any): Promise<AnyMessagingRequest<DataFlow>[]> | AnyMessagingRequest<DataFlow>[];
}

export class UsecasesRegistry
{
	constructor(private readonly usecases: Record<string, Usecase>,
				private readonly logger: Logger){}

	run(usecaseName: string, authorId: LgonId<"user">, source: MessagingSource<AdapterKind>, ...args: any): Promise<AnyMessagingRequest<DataFlow>[]> | AnyMessagingRequest<DataFlow>[]
	{
		this.logger.event( { code: "USECASE", data: { userId: authorId ,command: usecaseName } } );
		return (this.usecases[usecaseName].run(authorId, source, ...args));
	}
}
