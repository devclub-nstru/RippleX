import {
  RippleFunctionInterface,
  RippleInterface,
} from "../interfaces/ripple.interface";
import { ripplePrimitive } from "../utils/ripplePrimitive";
import { rippleObject } from "../utils/rippleObject";
import { rippleProxy } from "../utils/rippleProxy";
import { createImmerStore } from "../utils/immer";

export const ripple = function <T>(initial: T): RippleInterface<T> {
  return isObject(initial) ? rippleObject(initial) : ripplePrimitive(initial);
} as RippleFunctionInterface;

function isObject(value: unknown): value is object | any[] {
  return typeof value === "object" && value !== null;
}

Object.assign(ripple, {
  proxy: rippleProxy,
  primitive: ripplePrimitive,
  object: rippleObject,
  immer: createImmerStore,
});
