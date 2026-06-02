import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';

interface TraceContext
{
	id: string;
}

const traceStorage = new AsyncLocalStorage<TraceContext>();

export function runWithTrace<T>(fn: () => T): T
{
	return (traceStorage.run({ id: randomUUID() }, fn));
}

export function getTraceId(): string | undefined
{
	return traceStorage.getStore()?.id;
}
