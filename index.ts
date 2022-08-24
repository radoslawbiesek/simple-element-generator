#!/usr/bin/env node
import config from "./config.js";

main();

function main() {
  printHelp();
}

type Element = {
  name: string;
  alias: string;
  description: string;
  defaultWithTest: boolean;
};

export type Config = Element[];

function printHelp(): void {
  const colWidth = 25;
  console.log("Usage: npm run generate|g\n");
  console.log("Commands:");
  console.log("-h, --help".padEnd(colWidth), "Output usage information.");
  console.log(
    "[name|alias] [options]".padEnd(colWidth),
    "Generate a new element.\n"
  );

  printAvailableElements();

  console.log("Options:");
  console.log(
    "--with-test".padEnd(colWidth),
    "Enforce test file generation (if not set by default)."
  );
  console.log(
    "--no-test".padEnd(colWidth),
    "Disable test file generation (if set by default)."
  );
}

function printAvailableElements() {
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
