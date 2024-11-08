import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { OriginatorProfileSetItem } from "./originator-profile-set";

export const SiteProfile = {
  title: "Site Profile",
  type: "object",
  additionalProperties: true,
  properties: {
    originators: {
      type: "array",
      items: OriginatorProfileSetItem,
      minItems: 1,
    },
    credential: {
      type: "string",
      title: "Credential",
    },
  },
  required: ["originators", "credential"],
} as const satisfies JSONSchema;

export type SiteProfile = FromSchema<typeof SiteProfile>;

export default SiteProfile;
