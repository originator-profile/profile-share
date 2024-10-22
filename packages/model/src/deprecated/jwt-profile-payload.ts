import { FromSchema } from "json-schema-to-ts";
import JwtDpPayload from "./jwt-dp-payload";
import JwtOpPayload from "./jwt-op-payload";

/** @deprecated */
const JwtProfilePayload = {
  deprecated: true,
  title: "Profile JWT Claims Set object",
  anyOf: [JwtOpPayload, JwtDpPayload],
} as const;

/** @deprecated */
type JwtProfilePayload = FromSchema<typeof JwtProfilePayload>;

export default JwtProfilePayload;
