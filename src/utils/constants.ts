export const RIPPLE_BRAND = Symbol("signal");
export let isBatching = false;
export let dirtyStores = new Set<() => void>();
