import type { Logger } from "infra/Logger.js";
import { LgonId } from "types/LgonId.js";

export interface Usecase
{
	run(...args: any): Promise<void> | void;
}

export class UsecasesRegistry
{
	constructor(private readonly usecases: Record<string, Usecase>,
				private readonly logger: Logger){}

	run(usecaseName: string, authorId: LgonId<"user">, ...args: any)
	{
		this.logger.event( { code: "USECASE", data: { userId: authorId ,command: usecaseName } } );
		this.usecases[usecaseName].run(authorId, ...args);
	}

}