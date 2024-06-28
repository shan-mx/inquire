# Inquire

Collect user input with type-safety and ease.

## Installation

```bash
npx jsr add @mxkit/inquire
```

```bash
pnpm dlx jsr add @mxkit/inquire
```

```bash
bunx jsr add @mxkit/inquire
```

## Usage

```javascript
import { Inquire } from "@mxkit/inquire";

const result = await new Inquire()
  .input({ name: "name", type: "string", message: "What's your name?" })
  .input({ name: "age", type: "number", message: "What's your age?" })
  .select({
    name: "job",
    choices: ["student", "worker", "other"],
    message: "What's your job?",
  })
  .check({
    name: "pizza",
    values: ["cheese", "pepperoni", "mushrooms"],
    message: "What's your favorite pizza?",
  })
  .confirm({
    name: "confirm",
    message: "Do you confirm?",
  })
  .run();

/*
Inferred type: 
{
  name: string;
  age: number;
  job: "student" | "worker" | "other";
  pizza: ("cheese" | "pepperoni" | "mushrooms")[];
  confirm: boolean;
}
*/
console.log(result);
```

## Credits

- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)
