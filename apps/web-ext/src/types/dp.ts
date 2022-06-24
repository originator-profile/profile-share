import { Dp as DpModel } from "@webdino/profile-model";
import OgWebsite from "@webdino/profile-model/src/og-website";

export type Dp = DpModel & { error?: Error };
export type { default as DpItem } from "@webdino/profile-model/src/dp-item";
export type DpWebsite = OgWebsite;
