import { RippleInterface } from "./ripple.interface";

export interface OptionsInterface {
  loadingSignal?: RippleInterface<boolean>;
  errorSignal?: RippleInterface<string>;
  [key: string]: any;
}
