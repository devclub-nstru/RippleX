import { proxyCache, RIPPLE_BRAND, IS_RIPPLE_PROXY } from "./constants";

function isObject(value: unknown): value is object | any[] {
  return typeof value === "object" && value !== null;
}

export function createProxy<T extends object>(target: T, notify: () => void): T {
  if ((target as any)[IS_RIPPLE_PROXY]) return target;
  const cached = proxyCache.get(target);
  if (cached) return cached;

  const proxy: any = new Proxy(target, {
    get(obj, key, receiver) {
      const val = Reflect.get(obj, key, receiver);
      if (isObject(val) && !(RIPPLE_BRAND in val)) {
        if (!proxyCache.has(val)) {
          const nestedProxy = createProxy(val as any, notify);
          proxyCache.set(val, nestedProxy);
          return nestedProxy;
        }
        return proxyCache.get(val);
      }
      return val;
    },
    set(obj, key, value) {
      const old = obj[key as keyof T];
      const newVal =
        isObject(value) && !(RIPPLE_BRAND in value)
          ? createProxy(value as any, notify)
          : value;
      const res = Reflect.set(obj, key, newVal);
      if (!Object.is(old, newVal)) notify();
      return res;
    },
    deleteProperty(obj, key) {
      const res = Reflect.deleteProperty(obj, key);
      notify();
      return res;
    },
  });

  Object.defineProperty(proxy, IS_RIPPLE_PROXY, {
    value: true,
    enumerable: false,
  });
  proxyCache.set(target, proxy);
  return proxy;
}