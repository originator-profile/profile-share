import { Flags } from "@oclif/core";

export const operation = Flags.custom<"create" | "read" | "update" | "delete">({
  char: "o",
  description: "操作",
  options: ["create", "read", "update", "delete"],
  required: true,
});
