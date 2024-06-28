import type { CheckStepOption, InferCheckStepOption } from "../steps/check";
import type {
  ConfirmStepOption,
  InferConfirmResultType,
} from "../steps/confirm";
import type { InputStepOption } from "../steps/input";
import type {
  InferSelectResultType,
  InferSelectStepOption,
  SelectStepOption,
} from "../steps/select";

import {
  type InferInputResultType,
  type InferInputStepOption,
} from "../steps/input";

export interface BaseOption<K = string> {
  name: K;
  message: string;
}

export abstract class Step<T extends StepOption> {
  constructor(public option: T) {}

  abstract run(): Promise<InferStepResultType<T>>;
}

export type StepType = "input" | "select" | "confirm" | "check";

export type StepOption =
  | InputStepOption
  | SelectStepOption
  | ConfirmStepOption
  | CheckStepOption;

export type InferStepResultType<T> =
  T extends InferInputStepOption<infer U>
    ? InferInputResultType<U>
    : T extends InferCheckStepOption<infer W>
      ? W[]
      : T extends InferSelectStepOption<infer V>
        ? InferSelectResultType<V>
        : T extends ConfirmStepOption
          ? InferConfirmResultType
          : never;
