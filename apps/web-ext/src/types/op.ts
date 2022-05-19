import { Op } from "@webdino/profile-model";
import { OpPayload } from "@webdino/profile-sign/src/types";
import { JWTPayload } from "jose";

export { Op } from "@webdino/profile-model";
export type JwtOpPayload = OpPayload &
  Required<Pick<JWTPayload, "iss" | "sub" | "iat" | "exp">>;
export type OpItem = Op["item"][number];
export type OpHolder = Extract<OpItem, { type: "holder" }>;
