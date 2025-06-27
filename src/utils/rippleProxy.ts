import { dirtyStores, isBatching, RIPPLE_BRAND } from "./constants";
import { RippleInterface } from "../interfaces/ripple.interface";
import { createProxy } from "./createProxy";

export function rippleProxy<T extends object>(target: T): RippleInterface<T> {
  const listeners = new Set<() => void>();

  const notify = () => {
    if (isBatching) {
      dirtyStores.add(notify);
    } else {
      for (const listener of listeners) listener();
    }
  };

  const proxy = createProxy(target, notify);

  const rippleObj: RippleInterface<T> = {
    value: proxy,
    peek: () => proxy,
    subscribe: (cb: () => void, _selector?: (v: T) => unknown) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    brand: RIPPLE_BRAND,
  };
  return rippleObj;
}
