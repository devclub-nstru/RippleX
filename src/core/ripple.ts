export { computed, effect } from "@preact/signals";
import { useSyncExternalStore } from "react";

export interface Ripple<T> {
  value: T;
  subscribe: (cb: () => void) => () => void;
  peek: () => T;
  toJSON: () => T;
  brand: symbol;
}

const RIPPLE_BRAND = Symbol("signal");

export function ripple<T>(initial: T): Ripple<T> {
  let _value = initial;
  const subscribers = new Set<() => void>();

  const subscribe = (cb: () => void) => {
    subscribers.add(cb);
    return () => subscribers.delete(cb);
  };

  return {
    get value() {
      return _value;
    },
    set value(val: T) {
      _value = val;
      subscribers.forEach((cb) => cb());
    },
    subscribe,
    peek: () => _value,
    toJSON: () => _value,
    brand: RIPPLE_BRAND,
  };
}

export function useRipple<T>(ripple: {
  value: T;
  subscribe: (cb: () => void) => () => void;
}) {
  return useSyncExternalStore(ripple.subscribe, () => ripple.value);
}
