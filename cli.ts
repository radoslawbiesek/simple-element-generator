#!/usr/bin/env node

import config from "./config.js";

type Element = {
  name: string;
  alias: string;
  description: string;
  defaultWithTest: boolean;
};

export type Config = Element[];

const COMMANDS = {
  generate: {
    cmd: "generate",
    cmdAlias: "g",
    desc: "Generate a new element.",
    validOptions: {
      noTest: {
        option: "--no-test",
        desc: "Enforce test file generation (if not set by default).",
      },
      withTest: {
        option: "--with-test",
        desc: "Disable test file generation (if set by default).",
      },
    },
  },
  help: {
    cmd: "--help",
    cmdAlias: "-h",
    desc: "Output usage information.",
  },
} as const;

function main() {
  const args = process.argv.slice(2);

  if (
    args.includes(COMMANDS.help.cmd) ||
    args.includes(COMMANDS.help.cmdAlias)
  ) {
    printHelp();
    return;
  }

  const cmd = args[0];
  if (cmd !== COMMANDS.generate.cmd && cmd !== COMMANDS.generate.cmdAlias) {
    printInvalidUsageError(cmd);
    return;
  }

  const el = getByNameOrAlias(args[1]);
  const name = validateName(args[2]);
  const options = args.slice(3);
  if (validateOptions(options)) {
  }
}

main();

const validOptionsArr = Object.values(COMMANDS.generate.validOptions).map(
  (opt) => opt.option
);

function validateOptions(
  options: string[] | undefined
): options is typeof validOptionsArr[number][] {
  if (!options) return true;

  options.forEach((option) => {
    if (!(option in validOptionsArr)) {
      printError(
        `\nError. Invalid option: ${option}. \nAvailable options: ${COMMANDS.generate.validOptions.join(
          ", "
        )}\n`
      );
    }
  });

  return true;
}

function validateName(name: string | undefined) {
  if (!name) {
    printError("Name is required");
  }

  return name;
}

function getByNameOrAlias(str: string): Element {
  const el = config.find((el) => el.name === str || el.alias === str);
  if (!el) {
    printInvalidElementError(str);
  }

  return el;
}

// PRINTING HELPERS

function printHelp(): void {
  const formatCol = (str: string) => str.padEnd(40).padStart(40 + 2);

  console.log("Usage: ./cli.js\n");
  console.log("Commands:");
  console.log(
    formatCol(`${COMMANDS.help.cmd}, ${COMMANDS.help.cmdAlias}`),
    COMMANDS.help.desc
  );
  console.log(
    formatCol(
      `${COMMANDS.generate.cmd}|${COMMANDS.generate.cmdAlias} [name|alias] [options]`
    ),
    COMMANDS.generate.desc
  );

  printAvailableElements();

  console.log("Options:");
  Object.values(COMMANDS.generate.validOptions).forEach(({ option, desc }) => {
    console.log(formatCol(option), desc);
  });
}

function printAvailableElements(): void {
  const columns: {
    title: {
      [K in keyof Element]: Element[K] extends string ? K : never;
    }[keyof Element];
    width: number;
  }[] = [
    { title: "name", width: 15 },
    { title: "alias", width: 10 },
    { title: "description", width: 30 },
  ];

  console.log("Available elements:\n");

  console.log(...columns.map((col) => col.title.padEnd(col.width)));
  console.log(
    "-".repeat(columns.reduce((acc, column) => acc + column.width, 0))
  );
  config.forEach((el) => {
    console.log(...columns.map((col) => el[col.title].padEnd(col.width)));
  });
  console.log("");
}

function printError(message: string): never {
  console.error(message);
  process.exit(1);
}

function printInvalidUsageError(command: string): never {
  printError(
    `\nError. Invalid command: ${command}. \nSee --help for a list of available commands.\n`
  );
}

function printInvalidElementError(element: string): never {
  printError(
    `\nError. Invalid element: ${element}. \nSee --help for a list of available elements.\n`
  );
}
