import input from "@inquirer/input";

import { type BaseOption, Step } from "../core/types";

export type InputValueType = "string" | "number";

export interface InferInputStepOption<T extends InputValueType>
  extends BaseOption {
  type: T;
}

export type InputStepOption = InferInputStepOption<InputValueType>;

export type InferInputResultType<T extends InputValueType> = T extends "string"
  ? string
  : T extends "number"
    ? number
    : never;

export type InputResultType = InferInputResultType<InputValueType>;

export class InputStep extends Step<InputStepOption> {
  constructor(public option: InputStepOption) {
    super(option);
  }

  async run(): Promise<InferInputResultType<InputStepOption["type"]>> {
    if (this.option.type === "string") {
      return await input({
        message: this.option.message,
      });
    }
    if (this.option.type === "number") {
      const result = await input({
        message: this.option.message,
        validate: (input: string) => {
          const num = Number(input);

          return !Number.isNaN(num);
        },
      });

      return Number(result);
    }

    return undefined as never;
  }
}
