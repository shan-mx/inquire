import select from "@inquirer/select";

import { type BaseOption, Step } from "../core/types";

export type SelectChoiceType = string;

export interface InferSelectStepOption<T extends SelectChoiceType>
  extends BaseOption {
  choices: T[];
}

export type SelectStepOption = InferSelectStepOption<SelectChoiceType>;

export type InferSelectResultType<T extends SelectChoiceType> = T;

export type SelectResultType = InferSelectResultType<SelectChoiceType>;

export class SelectStep<T extends SelectChoiceType> extends Step<
  InferSelectStepOption<T>
> {
  constructor(public option: InferSelectStepOption<T>) {
    super(option);
  }

  async run(): Promise<InferSelectResultType<T>> {
    return await select({
      message: this.option.message,
      choices: this.option.choices.map((value) => ({
        name: value,
        value,
      })),
    });
  }
}
