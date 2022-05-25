import { Op as OpModel } from "@webdino/profile-model";
import { OpPayload } from "@webdino/profile-sign/src/types";
import { JWTPayload } from "jose";

export type Op = OpModel & { error?: Error };
export type JwtOpPayload = OpPayload &
  Required<Pick<JWTPayload, "iss" | "sub" | "iat" | "exp">>;
export type OpItem = Op["item"][number];
export type OpHolder = Extract<OpItem, { type: "holder" }>;
export type OpCertifier = Extract<OpItem, { type: "certifier" }>;
export type OpCredential = Extract<OpItem, { type: "credential" }>;
