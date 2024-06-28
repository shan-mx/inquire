import type { CheckStepOption } from "../steps/check";
import type {
  InferInputStepOption,
  InputStepOption,
  InputValueType,
} from "../steps/input";
import type { SelectStepOption } from "../steps/select";
import type {
  BaseOption,
  InferStepResultType,
  StepOption,
  StepType,
} from "./types";

import {
  type CheckChoiceType,
  CheckStep,
  type InferCheckStepOption,
} from "../steps/check";
import { ConfirmStep, type ConfirmStepOption } from "../steps/confirm";
import { InputStep } from "../steps/input";
import {
  type InferSelectStepOption,
  type SelectChoiceType,
  SelectStep,
} from "../steps/select";

type InquireResults<T> = {
  [K in keyof T]: InferStepResultType<T[K]>;
};

/**
 * Represents an interactive inquiry flow.
 * Allows defining and running a series of steps for user input.
 */
export class Inquire<
  T extends Record<string, StepOption & { step: StepType }>,
> {
  private steps: T = {} as T;

  /**
   * Adds an input step to the inquiry flow.
   *
   * @param option - The options for the input step.
   * @returns A new instance of Inquire with the added input step.
   */
  input<K extends string, U extends InputValueType>(
    option: InferInputStepOption<U> & BaseOption<K>,
  ): Inquire<T & { [key in K]: InferInputStepOption<U> }> {
    return this.addStep("input", option);
  }

  /**
   * Adds a select step to the inquiry flow.
   *
   * @param option - The options for the select step.
   * @returns A new instance of Inquire with the added select step.
   */
  select<K extends string, U extends SelectChoiceType>(
    option: InferSelectStepOption<U> & BaseOption<K>,
  ): Inquire<T & { [key in K]: InferSelectStepOption<U> }> {
    return this.addStep("select", option);
  }

  /**
   * Adds a check step to the inquiry flow.
   *
   * @param option - The options for the check step.
   * @returns A new instance of Inquire with the added check step.
   */
  check<K extends string, U extends CheckChoiceType>(
    option: InferCheckStepOption<U> & BaseOption<K>,
  ): Inquire<T & { [key in K]: InferCheckStepOption<U> }> {
    return this.addStep("check", option);
  }

  /**
   * Adds a confirm step to the inquiry flow.
   *
   * @param option - The options for the confirm step.
   * @returns A new instance of Inquire with the added confirm step.
   */
  confirm<K extends string>(
    option: ConfirmStepOption & BaseOption<K>,
  ): Inquire<T & { [key in K]: ConfirmStepOption }> {
    return this.addStep("confirm", option);
  }

  /**
   * Adds a step to the Inquire instance.
   * @template K - The type of the step name.
   * @template U - The type of the step option.
   * @param {StepType} type - The type of the step.
   * @param {U & BaseOption<K>} step - The step to be added.
   * @returns {Inquire<T & { [key in K]: U }>} - A new Inquire instance with the added step.
   */
  private addStep<K extends string, U extends StepOption>(
    type: StepType,
    step: U & BaseOption<K>,
  ) {
    const newSteps = {
      ...this.steps,
      [step.name]: { ...step, step: type },
    };

    const newInquire = new Inquire<T & { [key in K]: U }>();
    newInquire.steps = newSteps;

    return newInquire;
  }

  /**
   * Runs the inquiry flow and returns the results.
   *
   * @returns A promise that resolves to the results of the inquiry flow.
   */
  async run(): Promise<InquireResults<T>> {
    const result: Record<string, any> = {};
    for (const [key, option] of Object.entries(this.steps)) {
      if (option.step === "input") {
        result[key] = await new InputStep(option as InputStepOption).run();
      }
      if (option.step === "select") {
        result[key] = await new SelectStep(option as SelectStepOption).run();
      }
      if (option.step === "check") {
        result[key] = await new CheckStep(option as CheckStepOption).run();
      }
      if (option.step === "confirm") {
        result[key] = await new ConfirmStep(option as ConfirmStepOption).run();
      }
    }

    return result as InquireResults<T>;
  }
}
