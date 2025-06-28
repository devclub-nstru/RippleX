import { RippleInterface } from "../interfaces/ripple.interface";
import { RIPPLE_BRAND } from "./constants";

export function ripplePrimitive<T>(initial: T): RippleInterface<T> {
  let _value = initial;
  const subscribers = new Set<{
    callback: () => void;
    selector: (v: T) => unknown;
    prevValue: unknown;
  }>();

  const subscribe = (
    callback: () => void,
    selector: (v: T) => unknown = (v) => v
  ) => {
    const sub = { callback, selector, prevValue: selector(_value) };
    subscribers.add(sub);
    return () => subscribers.delete(sub);
  };

  return {
    get value() {
      return _value;
    },
    set value(val: T) {
      if (Object.is(_value, val)) return;
      _value = val;
      for (const sub of subscribers) {
        const next = sub.selector(_value);
        if (!Object.is(next, sub.prevValue)) {
          sub.prevValue = next;
          sub.callback();
        }
      }
    },
    subscribe,
    peek: () => _value,
    brand: RIPPLE_BRAND,
  };
}
