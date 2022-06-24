import { Op as OpModel } from "@webdino/profile-model";

export type Op = OpModel & { error?: Error };
export type { default as OpItem } from "@webdino/profile-model/src/op-item";
export type { default as OpHolder } from "@webdino/profile-model/src/op-holder";
