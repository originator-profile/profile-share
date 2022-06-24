import { FromSchema } from "json-schema-to-ts";
import JwtDpPayload from "./jwt-dp-payload";
import JwtOpPayload from "./jwt-op-payload";

const JwtProfilePayload = {
  title: "Profile JWT Claims Set object",
  anyOf: [JwtOpPayload, JwtDpPayload],
} as const;

type JwtProfilePayload = FromSchema<typeof JwtProfilePayload>;

export default JwtProfilePayload;
