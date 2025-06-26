declare function ripple<T>(initial: T): RippleInterface<T>;
declare namespace ripple {
  export function proxy<T extends object>(initial: T): RippleInterface<T>;
  export function signal<T>(initial: T): RippleInterface<T>;
}