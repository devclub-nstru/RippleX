export { computed, effect } from "@preact/signals";
import { RippleInterface } from "../interfaces/ripple.interface";
import { ripplePrimitive } from "../utils/ripplePrimitive";
import { rippleObject } from "../utils/rippleObject";

export const RIPPLE_BRAND = Symbol("signal");

export function ripple<T>(initial: T): RippleInterface<T> {
  if (typeof initial === "object" && initial !== null) {
    return rippleObject(initial as any) as RippleInterface<T>;
  }
  return ripplePrimitive(initial);
}
