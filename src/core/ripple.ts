export { computed, effect } from "@preact/signals";
import {
  RippleFunctionInterface,
  RippleInterface,
} from "../interfaces/ripple.interface";
import { ripplePrimitive } from "../utils/ripplePrimitive";
import { rippleObject } from "../utils/rippleObject";
import { rippleProxy } from "../utils/rippleProxy";

const ripple = function <T>(initial: T): RippleInterface<T> {
  return isObject(initial) ? rippleObject(initial) : ripplePrimitive(initial);
} as RippleFunctionInterface;

function isObject(value: unknown): value is object | Array<any> {
  return (typeof value === "object" && value !== null) || Array.isArray(value);
}

Object.assign(ripple, {
  proxy: rippleProxy,
  primitive: ripplePrimitive,
  object: rippleObject,
});

export { ripple };
