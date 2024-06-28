import checkbox from "@inquirer/checkbox";

import { type BaseOption, Step } from "../core/types";

export type CheckChoiceType = string;

export interface InferCheckStepOption<T extends CheckChoiceType>
  extends BaseOption {
  values: T[];
}

export type CheckStepOption = InferCheckStepOption<CheckChoiceType>;

export type InferCheckResultType<T extends CheckChoiceType> = T[];

export type CheckResultType = InferCheckResultType<CheckChoiceType>;

export class CheckStep<T extends CheckChoiceType> extends Step<
  InferCheckStepOption<T>
> {
  constructor(public option: InferCheckStepOption<T>) {
    super(option);
  }

  async run(): Promise<InferCheckResultType<T>> {
    return await checkbox({
      message: this.option.message,
      choices: this.option.values.map((value) => ({
        name: value,
        value,
      })),
    });
  }
}
