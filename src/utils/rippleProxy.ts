import { dirtyStores, isBatching, RIPPLE_BRAND } from "./constants";
import { RippleInterface } from "../interfaces/ripple.interface";
import { createProxy } from "./createProxy";

export function rippleProxy<T extends object>(target: T): RippleInterface<T> {
  const listeners = new Set<() => void>();

  const notify = () => {
    if (isBatching) dirtyStores.add(notify);
    else listeners.forEach((l) => l());
  };

  const proxy = createProxy(target, notify);

  return {
    value: proxy,
    peek: () => proxy,
    subscribe: (cb: () => void) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    brand: RIPPLE_BRAND,
  };
}