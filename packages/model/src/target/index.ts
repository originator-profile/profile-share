import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { BasicTarget } from "./basic-target";
import { ExternalResourceTarget } from "./external-resource-target";

export * from "./basic-target";
export * from "./external-resource-target";

export const Target = {
  title: "Target",
  oneOf: [BasicTarget, ExternalResourceTarget],
} as const satisfies JSONSchema;

export type Target = FromSchema<typeof Target>;
