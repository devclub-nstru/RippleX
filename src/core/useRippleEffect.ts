import { useEffect, useRef } from "react";
import { on } from "./eventBus";
import { RippleInterface } from "../interfaces/ripple.interface";
import { HandlerType } from "../types/handler.types";
import { OptionsInterface } from "../interfaces/options.interface";

export function useRippleEffect(
  event: string,
  handler: HandlerType,
  options?: OptionsInterface | RippleInterface<any>
) {
  const stableHandler = useRef(handler);
  useEffect(() => {
    stableHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    let cancelled = false;
    const tools = { aborted: () => cancelled };

    const wrapped = async (payload?: any) => {
      if (cancelled) return;

      let loadingSignal: RippleInterface<boolean> | undefined;
      let errorSignal: RippleInterface<any> | undefined;

      if (
        options &&
        typeof options === "object" &&
        "value" in options &&
        typeof options.value === "object"
      ) {
        const obj = options.value;
        if ("loading" in obj && typeof obj.loading === "boolean") {
          loadingSignal = {
            get value() {
              return options.value.loading;
            },
            set value(val: boolean) {
              options.value = { ...options.value, loading: val };
            },
          } as RippleInterface<boolean>;
        }
        if ("error" in obj) {
          errorSignal = {
            get value() {
              return options.value.error;
            },
            set value(val: any) {
              options.value = { ...options.value, error: val };
            },
          } as RippleInterface<any>;
        }
      } else {
        loadingSignal =
          (options as OptionsInterface)?.loadingSignal ??
          ((options as OptionsInterface)?.loading as RippleInterface<boolean>);
        errorSignal =
          (options as OptionsInterface)?.errorSignal ??
          ((options as OptionsInterface)?.error as RippleInterface<any>);
      }

      loadingSignal && (loadingSignal.value = true);
      errorSignal && (errorSignal.value = null);

      try {
        const result = stableHandler.current(payload, tools);
        if (result instanceof Promise) {
          const awaited = await result;

          if (awaited instanceof Response && !awaited.ok) {
            throw new Error(`HTTP ${awaited.status}: ${awaited.statusText}`);
          }
        }
      } catch (error) {
        if (errorSignal) {
          errorSignal.value = error;
        }
      } finally {
        if (loadingSignal) {
          loadingSignal.value = false;
        }
      }
    };

    const unsubscribe = on(event, wrapped);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [event]);
}
