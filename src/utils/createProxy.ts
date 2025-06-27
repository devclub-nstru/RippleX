import { dirtyStores, isBatching, RIPPLE_BRAND } from "./constants";

export function createProxy<T extends object>(
  target: T,
  notify: () => void,
): T {
  const proxy = new Proxy(target, {
    get(obj, key, receiver) {
      const value = Reflect.get(obj, key, receiver);
      if (
        typeof value === "object" &&
        value !== null &&
        !(RIPPLE_BRAND in value)
      ) {
        return createProxy(value as any, notify);
      }
      return value;
    },
    set(obj, key, value) {
      const old = obj[key as keyof T];
      const newVal =
        typeof value === "object" && value !== null && !(RIPPLE_BRAND in value)
          ? createProxy(value as any, notify)
          : value;

      const result = Reflect.set(obj, key, newVal);
      if (!Object.is(old, value)) {
        if (isBatching) {
          dirtyStores.add(notify);
        } else {
          notify();
        }
      }
      return result;
    },
    deleteProperty(obj, key) {
      const result = Reflect.deleteProperty(obj, key);
      if (isBatching) {
        dirtyStores.add(notify);
      } else {
        notify();
      }
      return result;
    },
  });
  return proxy;
}
