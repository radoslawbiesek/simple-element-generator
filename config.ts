import { Config } from "./cli.js";

const config: Config = [
  {
    name: "component",
    alias: "c",
    description: "Generate a new component",
    defaultWithTest: true,
  },
  {
    name: "page",
    alias: "p",
    description: "Generate a new page",
    defaultWithTest: true,
  },
  {
    name: "service",
    alias: "s",
    description: "Generate a new service",
    defaultWithTest: false,
  },
  {
    name: "connector",
    alias: "conn",
    description: "Generate a new connector",
    defaultWithTest: true,
  },
];

export default config;
