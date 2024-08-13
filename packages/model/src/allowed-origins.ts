import { FromSchema } from "json-schema-to-ts";
import DpAllowedOrigins from "./dp-allowed-origins";

const allowedOrigins = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "Allowed Origins",
  type: "array",
  items: {
    type: "string",
    format: "uri",
  },
  description:
    "Web Assertion によって表明される情報の対象となる [origin](https://www.rfc-editor.org/rfc/rfc6454#section-7)",
  not: DpAllowedOrigins,
} as const;

type AllowedOrigins = FromSchema<typeof allowedOrigins>;

export default allowedOrigins;
export type { AllowedOrigins };
