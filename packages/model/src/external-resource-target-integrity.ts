import { FromSchema } from "json-schema-to-ts";

const externalResourceTargetIntegrity = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "External Resource Target Integrity",
  type: "object",
  additionalProperties: true,
  properties: {
    type: {
      type: "string",
      enum: ["externalResource"],
    },
    integrity: {
      type: "string",
    },
    url: {
      type: "string",
      format: "uri",
    },
  },
  required: ["type", "integrity", "url"],
} as const;

type ExternalResourceTargetIntegrity = FromSchema<
  typeof externalResourceTargetIntegrity
>;

export default externalResourceTargetIntegrity;
export type { ExternalResourceTargetIntegrity };
