import { RippleInterface } from "../interfaces/ripple.interface";
import { createProxy } from "./createProxy";
import { RIPPLE_BRAND } from "./constants";

export function rippleObject<T extends object>(initial: T): RippleInterface<T> {
  let rawValue = initial;

  const subscribers = new Set<{
    callback: () => void;
    selector: (v: T) => unknown;
    prevValue: unknown;
  }>();

  const notify = () => {
    for (const sub of subscribers) {
      const nextVal = sub.selector(proxyValue);
      if (!Object.is(nextVal, sub.prevValue)) {
        sub.prevValue = nextVal;
        sub.callback();
      }
    }
  };

  let proxyValue = createProxy(initial, notify);

  const subscribe = (
    callback: () => void,
    selector: (v: T) => unknown = (v) => v
  ) => {
    const subscriber = {
      callback,
      selector,
      prevValue: selector(proxyValue),
    };
    subscribers.add(subscriber);
    return () => subscribers.delete(subscriber);
  };

  return {
    get value() {
      return proxyValue;
    },
    set value(newVal: T) {
      if (!Object.is(rawValue, newVal)) {
        rawValue = newVal;
        proxyValue = createProxy(newVal, notify);
        notify();
      }
    },
    subscribe,
    peek: () => proxyValue,
    brand: RIPPLE_BRAND,
  };
}