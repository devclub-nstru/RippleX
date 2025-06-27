export const RIPPLE_BRAND = Symbol("signal");
export let isBatching = false;
export let dirtyStores = new Set<() => void>();
export const proxyCache = new WeakMap<object, any>();
export const IS_RIPPLE_PROXY = Symbol("isRippleProxy");