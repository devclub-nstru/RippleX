export { computed, effect } from "@preact/signals";
import { RippleInterface } from "../interfaces/ripple.interface";
import { ripplePrimitive } from "../utils/ripplePrimitive";
import { rippleObject } from "../utils/rippleObject";

export const RIPPLE_BRAND = Symbol("signal");

function ripple<T>(initial: T): RippleInterface<T> {
  return isObject(initial) 
    ? rippleObject(initial) 
    : ripplePrimitive(initial);
}

function isObject(value: unknown): value is object | Array<any> {
  return (typeof value === 'object' && value !== null) || Array.isArray(value);
}


Object.assign(ripple, {
  proxy: rippleObject,
  signal: ripplePrimitive
});

export { ripple };
