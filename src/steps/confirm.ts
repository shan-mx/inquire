import confirm from "@inquirer/confirm";

import { type BaseOption, Step } from "../core/types";

export type ConfirmStepOption = BaseOption;

export type InferConfirmResultType = boolean;

export class ConfirmStep extends Step<ConfirmStepOption> {
  constructor(public option: ConfirmStepOption) {
    super(option);
  }

  async run(): Promise<InferConfirmResultType> {
    return await confirm({ message: this.option.message });
  }
}
