export function createProxy<T extends object>(
  target: T,
  notify: () => void
): T {
  return new Proxy(target, {
    get(obj, key, receiver) {
      const value = Reflect.get(obj, key, receiver);
      if (typeof value === "object" && value !== null) {
        return createProxy(value as any, notify);
      }
      return value;
    },
    set(obj, key, value) {
      const old = obj[key as keyof T];

      const newVal =
        typeof value === "object" && value !== null
          ? createProxy(value as any, notify)
          : value;

      const result = Reflect.set(obj, key, newVal);

      if (!Object.is(old, value)) {
        notify();
      }
      return result;
    },
    deleteProperty(obj, key) {
      const result = Reflect.deleteProperty(obj, key);
      notify();
      return result;
    },
  });
}
