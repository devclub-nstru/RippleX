import { ListenerInterface } from "../interfaces/listener.interface";

const eventBus = new Map<string, Set<ListenerInterface>>();

export function emit(event: string, payload?: string) {
  eventBus.get(event)?.forEach((fn) => fn(payload));
}

export function on(event: string, handler: ListenerInterface) {
  if (!eventBus.has(event)) {
    eventBus.set(event, new Set());
  }
  eventBus.get(event)?.add(handler);
  return () => {
    eventBus.get(event)?.delete(handler);
  };
}
