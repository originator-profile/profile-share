import { Op as OpModel } from "@webdino/profile-model";

export type Op = OpModel & { error?: Error };
export type OpItem = Op["item"][number];
export type OpHolder = Extract<OpItem, { type: "holder" }>;
export type OpCertifier = Extract<OpItem, { type: "certifier" }>;
export type OpCredential = Extract<OpItem, { type: "credential" }>;
