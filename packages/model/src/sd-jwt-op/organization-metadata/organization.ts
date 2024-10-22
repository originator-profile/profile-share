import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { OrganizationJp } from "./organization-jp";

export const Organization = {
  title: "Organization",
  oneOf: [OrganizationJp],
} as const satisfies JSONSchema;

export type Organization = FromSchema<typeof Organization>;
