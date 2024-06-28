import { Inquire } from "@/index";
import { CheckStep } from "@/steps/check";
import { ConfirmStep } from "@/steps/confirm";
import { InputStep } from "@/steps/input";
import { SelectStep } from "@/steps/select";
import { describe, expect, it, vi } from "vitest";

describe("Inquire", () => {
  describe("Type Inference", () => {
    it("should correctly infer input types", () => {
      const inquire = new Inquire()
        .input({ name: "name", type: "string", message: "What's your name" })
        .input({ name: "age", type: "number", message: "What's your age" });

      type Result = Awaited<ReturnType<typeof inquire.run>>;

      expectTypeOf<Result>().toMatchTypeOf<{
        name: string;
        age: number;
      }>();
    });

    it("should correctly infer select types", () => {
      const inquire = new Inquire().select({
        name: "job",
        choices: ["student", "worker", "other"] as const,
        message: "What's your job",
      });

      type Result = Awaited<ReturnType<typeof inquire.run>>;

      expectTypeOf<Result>().toMatchTypeOf<{
        job: "student" | "worker" | "other";
      }>();
    });

    it("should correctly infer check types", () => {
      const inquire = new Inquire().check({
        name: "pizza",
        values: ["cheese", "pepperoni", "mushrooms"] as const,
        message: "What's your favorite pizza?",
      });

      type Result = Awaited<ReturnType<typeof inquire.run>>;

      expectTypeOf<Result>().toMatchTypeOf<{
        pizza: ("cheese" | "pepperoni" | "mushrooms")[];
      }>();
    });

    it("should correctly infer confirm types", () => {
      const inquire = new Inquire().confirm({
        name: "confirm",
        message: "Do you confirm?",
      });

      type Result = Awaited<ReturnType<typeof inquire.run>>;

      expectTypeOf<Result>().toMatchTypeOf<{
        confirm: boolean;
      }>();
    });

    it("should correctly infer complex combined types", () => {
      const inquire = new Inquire()
        .input({ name: "name", type: "string", message: "What's your name" })
        .input({ name: "age", type: "number", message: "What's your age" })
        .select({
          name: "job",
          choices: ["student", "worker", "other"] as const,
          message: "What's your job",
        })
        .check({
          name: "pizza",
          values: ["cheese", "pepperoni", "mushrooms"] as const,
          message: "What's your favorite pizza?",
        })
        .confirm({
          name: "confirm",
          message: "Do you confirm?",
        });

      type Result = Awaited<ReturnType<typeof inquire.run>>;

      expectTypeOf<Result>().toMatchTypeOf<{
        name: string;
        age: number;
        job: "student" | "worker" | "other";
        pizza: ("cheese" | "pepperoni" | "mushrooms")[];
        confirm: boolean;
      }>();
    });
  });

  describe("Functionality", () => {
    it("should call the appropriate step methods in order", async () => {
      const inputSpy = vi
        .spyOn(InputStep.prototype, "run")
        .mockResolvedValue("John");

      const selectSpy = vi
        .spyOn(SelectStep.prototype, "run")
        .mockResolvedValue("worker");

      const checkSpy = vi
        .spyOn(CheckStep.prototype, "run")
        .mockResolvedValue(["cheese", "pepperoni"]);

      const confirmSpy = vi
        .spyOn(ConfirmStep.prototype, "run")
        .mockResolvedValue(true);

      const inquire = new Inquire()
        .input({ name: "name", type: "string", message: "What's your name" })
        .select({
          name: "job",
          choices: ["student", "worker", "other"],
          message: "What's your job",
        })
        .check({
          name: "pizza",
          values: ["cheese", "pepperoni", "mushrooms"],
          message: "What's your favorite pizza?",
        })
        .confirm({
          name: "confirm",
          message: "Do you confirm?",
        });

      const result = await inquire.run();

      expect(inputSpy).toHaveBeenCalledTimes(1);
      expect(selectSpy).toHaveBeenCalledTimes(1);
      expect(checkSpy).toHaveBeenCalledTimes(1);
      expect(confirmSpy).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        name: "John",
        job: "worker",
        pizza: ["cheese", "pepperoni"],
        confirm: true,
      });
    });

    it("should handle multiple inputs of different type", async () => {
      const inputSpy = vi
        .spyOn(InputStep.prototype, "run")
        .mockResolvedValueOnce("John")
        .mockResolvedValueOnce(30);

      const inquire = new Inquire()
        .input({ name: "name", type: "string", message: "What's your name" })
        .input({ name: "age", type: "number", message: "What's your age" });

      const result = await inquire.run();

      expect(inputSpy).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        name: "John",
        age: 30,
      });
    });
  });
});
