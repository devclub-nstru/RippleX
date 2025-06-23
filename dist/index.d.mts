interface Ripple<T> {
    value: T;
    subscribe: (cb: () => void) => () => void;
    peek: () => T;
    toJSON: () => T;
    brand: symbol;
}
declare function ripple<T>(initial: T): Ripple<T>;
declare function useRipple<T>(ripple: {
    value: T;
    subscribe: (cb: () => void) => () => void;
}): T;

type Handler = (payload?: any, tools?: {
    aborted: () => boolean;
}) => void | Promise<any>;
interface Options {
    loadingSignal?: Ripple<boolean>;
    errorSignal?: Ripple<any>;
    [key: string]: any;
}
declare function onRipple(event: string, handler: Handler, options?: Options): void;

export { type Ripple, onRipple, ripple, useRipple };
