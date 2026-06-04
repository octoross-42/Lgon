import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';
const traceStorage = new AsyncLocalStorage();
export function runWithTrace(fn) {
    return (traceStorage.run({ id: randomUUID() }, fn));
}
export function getTraceId() {
    return traceStorage.getStore()?.id;
}
