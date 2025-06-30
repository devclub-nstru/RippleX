// src/core/useRippleEffect.ts
import { useEffect, useRef } from "react";

// src/core/eventBus.ts
var eventBus = /* @__PURE__ */ new Map();
function emit(event, payload) {
  eventBus.get(event)?.forEach((fn) => fn(payload));
}
function on(event, handler) {
  if (!eventBus.has(event)) {
    eventBus.set(event, /* @__PURE__ */ new Set());
  }
  eventBus.get(event)?.add(handler);
  return () => {
    eventBus.get(event)?.delete(handler);
  };
}

// src/core/useRippleEffect.ts
function useRippleEffect(event, handler, options) {
  const stableHandler = useRef(handler);
  useEffect(() => {
    stableHandler.current = handler;
  }, [handler]);
  useEffect(() => {
    let cancelled = false;
    const tools = { aborted: () => cancelled };
    const wrapped = async (payload) => {
      if (cancelled) return;
      let loadingSignal;
      let errorSignal;
      if (options && typeof options === "object" && "value" in options && typeof options.value === "object") {
        const obj = options.value;
        if ("loading" in obj && typeof obj.loading === "boolean") {
          loadingSignal = {
            get value() {
              return options.value.loading;
            },
            set value(val) {
              options.value = { ...options.value, loading: val };
            }
          };
        }
        if ("error" in obj) {
          errorSignal = {
            get value() {
              return options.value.error;
            },
            set value(val) {
              options.value = { ...options.value, error: val };
            }
          };
        }
      } else {
        loadingSignal = options?.loadingSignal ?? options?.loading;
        errorSignal = options?.errorSignal ?? options?.error;
      }
      loadingSignal && (loadingSignal.value = true);
      errorSignal && (errorSignal.value = null);
      try {
        const result = stableHandler.current(payload, tools);
        if (result instanceof Promise) {
          const awaited = await result;
          if (awaited instanceof Response && !awaited.ok) {
            throw new Error(`HTTP ${awaited.status}: ${awaited.statusText}`);
          }
        }
      } catch (error) {
        if (errorSignal) {
          errorSignal.value = error;
        }
      } finally {
        if (loadingSignal) {
          loadingSignal.value = false;
        }
      }
    };
    const unsubscribe = on(event, wrapped);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [event]);
}

// src/utils/constants.ts
var RIPPLE_BRAND = Symbol("signal");
var isBatching = false;
var dirtyStores = /* @__PURE__ */ new Set();
var proxyCache = /* @__PURE__ */ new WeakMap();
var IS_RIPPLE_PROXY = Symbol("isRippleProxy");

// src/utils/ripplePrimitive.ts
function ripplePrimitive(initial) {
  let _value = initial;
  const subscribers = /* @__PURE__ */ new Set();
  const subscribe = (callback, selector = (v) => v) => {
    const sub = { callback, selector, prevValue: selector(_value) };
    subscribers.add(sub);
    return () => subscribers.delete(sub);
  };
  return {
    get value() {
      return _value;
    },
    set value(val) {
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
    brand: RIPPLE_BRAND
  };
}

// src/utils/createProxy.ts
function isObject(value) {
  return typeof value === "object" && value !== null;
}
function createProxy(target, notify) {
  if (target[IS_RIPPLE_PROXY]) return target;
  const cached = proxyCache.get(target);
  if (cached) return cached;
  const proxy = new Proxy(target, {
    get(obj, key, receiver) {
      const val = Reflect.get(obj, key, receiver);
      if (isObject(val) && !(RIPPLE_BRAND in val)) {
        if (!proxyCache.has(val)) {
          const nestedProxy = createProxy(val, notify);
          proxyCache.set(val, nestedProxy);
          return nestedProxy;
        }
        return proxyCache.get(val);
      }
      return val;
    },
    set(obj, key, value) {
      const old = obj[key];
      const newVal = isObject(value) && !(RIPPLE_BRAND in value) ? createProxy(value, notify) : value;
      const res = Reflect.set(obj, key, newVal);
      if (!Object.is(old, newVal)) notify();
      return res;
    },
    deleteProperty(obj, key) {
      const res = Reflect.deleteProperty(obj, key);
      notify();
      return res;
    }
  });
  Object.defineProperty(proxy, IS_RIPPLE_PROXY, {
    value: true,
    enumerable: false
  });
  proxyCache.set(target, proxy);
  return proxy;
}

// src/utils/rippleObject.ts
function rippleObject(initial) {
  let raw = initial;
  let proxyValue = createProxy(initial, notify);
  const subs = /* @__PURE__ */ new Set();
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
  const subscribe = (cb, sel = (v) => v) => {
    const sub = { cb, sel, prev: sel(proxyValue) };
    subs.add(sub);
    return () => subs.delete(sub);
  };
  return {
    get value() {
      return proxyValue;
    },
    set value(v) {
      if (Object.is(raw, v)) return;
      raw = v;
      proxyValue = createProxy(v, notify);
      notify();
    },
    subscribe,
    peek: () => proxyValue,
    brand: RIPPLE_BRAND
  };
}

// src/utils/rippleProxy.ts
function rippleProxy(target) {
  const listeners = /* @__PURE__ */ new Set();
  const notify = () => {
    if (isBatching) dirtyStores.add(notify);
    else listeners.forEach((l) => l());
  };
  const proxy = createProxy(target, notify);
  return {
    value: proxy,
    peek: () => proxy,
    subscribe: (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    brand: RIPPLE_BRAND
  };
}

// src/utils/immer.ts
var produce;
async function loadProduce() {
  if (produce) return produce;
  try {
    const immer = await import("./immer-763I5DHK.mjs");
    produce = immer.produce;
    return produce;
  } catch {
    throw new Error(
      "Immer is not installed. Run `npm i immer` or switch to the proxy-based ripple()."
    );
  }
}
function createImmerStore(initial) {
  const root = ripplePrimitive(initial);
  async function update(recipe) {
    const prod = await loadProduce();
    const next = prod(root.value, recipe);
    if (next !== root.value) root.value = next;
  }
  return Object.assign(root, { update });
}

// src/core/ripple.ts
var ripple = function(initial) {
  return isObject2(initial) ? rippleObject(initial) : ripplePrimitive(initial);
};
function isObject2(value) {
  return typeof value === "object" && value !== null;
}
Object.assign(ripple, {
  proxy: rippleProxy,
  primitive: ripplePrimitive,
  object: rippleObject,
  immer: createImmerStore
});

// src/core/useRipple.ts
import { useSyncExternalStore } from "react";
function useRipple(ripple2, selector = (v) => v) {
  return useSyncExternalStore(
    (cb) => ripple2.subscribe(cb, selector),
    () => selector(ripple2.value),
    () => selector(ripple2.peek())
  );
}
export {
  emit,
  on,
  ripple,
  useRipple,
  useRippleEffect
};
