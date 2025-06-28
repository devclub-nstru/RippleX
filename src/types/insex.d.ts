import { RippleInterface } from "../interfaces/ripple.interface";

declare function ripple<T>(initial: T): RippleInterface<T>;
declare namespace ripple {
  export function proxy<T extends object>(initial: T): RippleInterface<T>;
  export function primitive<T>(initial: T): RippleInterface<T>;
}
