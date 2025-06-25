import { RippleInterface } from "../interfaces/ripple.interface";
import { RIPPLE_BRAND } from "../core/ripple";

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
    const subscriber = {
      callback,
      selector,
      prevValue: selector(_value),
    };
    subscribers.add(subscriber);
    return () => subscribers.delete(subscriber);
  };

  return {
    get value() {
      return _value;
    },
    set value(val: T) {
      if (Object.is(_value, val)) return;
      _value = val;
      for (const sub of subscribers) {
        const nextVal = sub.selector(_value);
        if (!Object.is(nextVal, sub.prevValue)) {
          sub.prevValue = nextVal;
          sub.callback();
        }
      }
    },
    subscribe,
    peek: () => _value,
    brand: RIPPLE_BRAND,
  };
}
