import { RippleInterface } from "../interfaces/ripple.interface";
import { createProxy } from "./createProxy";
import { dirtyStores, isBatching, RIPPLE_BRAND } from "./constants";

export function rippleObject<T extends object>(initial: T): RippleInterface<T> {
  let raw = initial;
  let proxyValue = createProxy(initial, notify);

  const subs = new Set<{
    cb: () => void;
    sel: (v: T) => unknown;
    prev: unknown;
  }>();

  function notify() {
    if (isBatching) {
      dirtyStores.add(notify);
      return;
    }
    for (const s of subs) {
      const next = s.sel(proxyValue);
      if (!Object.is(next, s.prev)) {
        s.prev = next;
        s.cb();
      }
    }
  }

  const subscribe = (cb: () => void, sel: (v: T) => unknown = (v) => v) => {
    const sub = { cb, sel, prev: sel(proxyValue) };
    subs.add(sub);
    return () => subs.delete(sub);
  };

  return {
    get value() {
      return proxyValue;
    },
    set value(v: T) {
      if (Object.is(raw, v)) return;
      raw = v;
      proxyValue = createProxy(v, notify);
      notify();
    },
    subscribe,
    peek: () => proxyValue,
    brand: RIPPLE_BRAND,
  };
}