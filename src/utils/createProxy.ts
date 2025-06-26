export function createProxy<T extends object>(
  target: T,
  notify: () => void
): T {
  return new Proxy(target, {
    get(obj, key, receiver) {
      const value = Reflect.get(obj, key, receiver);
      // Deep proxy for nested objects/arrays
      if (typeof value === "object" && value !== null) {
        return createProxy(value as any, notify);
      }
      return value;
    },
    set(obj, key, value) {
      const old = obj[key as keyof T];
      const result = Reflect.set(obj, key, value);

      if (Array.isArray(obj) && key === 'length') {
        notify();
      } 

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
