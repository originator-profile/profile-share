import { FromSchema } from "json-schema-to-ts";
import JwtOpPayload from "./jwt-op-payload";
import JwtDpPayload from "./jwt-dp-payload";

const JwtProfilePayload = {
  title: "Profile JWT Claims Set object",
  anyOf: [JwtOpPayload, JwtDpPayload],
} as const;

type JwtProfilePayload = FromSchema<typeof JwtProfilePayload>;

export default JwtProfilePayload;
