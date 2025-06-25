import { useSyncExternalStore } from "react";
import { RippleInterface } from "../interfaces/ripple.interface";

export function useRipple<T, S = T>(
  ripple: RippleInterface<T>,
  selector: (value: T) => S = (v) => v as unknown as S
): S {
  return useSyncExternalStore(
    (cb) => ripple.subscribe(cb, selector),
    () => selector(ripple.value),
    () => selector(ripple.peek())
  );
}
