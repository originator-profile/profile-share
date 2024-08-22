import { FromSchema } from "json-schema-to-ts";
import { BasicTarget } from "./basic-target";
import { ExternalResourceTarget } from "./external-resource-target";

export * from "./basic-target";
export * from "./external-resource-target";

export const Target = {
  title: "Target",
  oneOf: [BasicTarget, ExternalResourceTarget],
} as const;

export type Target = FromSchema<typeof Target>;
