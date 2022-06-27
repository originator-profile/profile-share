import { Op as OpModel, OpItem, OpHolder } from "@webdino/profile-model";

export type Op = OpModel & { error?: Error };
export type { OpItem, OpHolder };
