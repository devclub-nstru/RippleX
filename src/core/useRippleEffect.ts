import { useEffect, useRef } from "react";
import { on } from "./eventBus";
import { RippleInterface } from "../interfaces/ripple.interface";
import { HandlerType } from "../types/handler.types";
import { OptionsInterface } from "../interfaces/options.interface";

export function useRippleEffect(
  event: string,
  handler: HandlerType,
  options?: OptionsInterface
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

      const loadingSignal =
        options?.loadingSignal ??
        (options?.loading as RippleInterface<boolean>);
      const errorSignal =
        options?.errorSignal ?? (options?.error as RippleInterface<any>);

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
