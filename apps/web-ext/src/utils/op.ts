import { Profile } from "../types/profile";
import { Op, OpItem, OpHolder, OpCertifier, OpCredential } from "../types/op";

const opItemTypes: OpItem["type"][] = ["holder", "certifier", "credential"];

export const isOp = (profile: Profile): profile is Op =>
  profile.item.some((item) =>
    opItemTypes.includes(item.type as OpItem["type"])
  );
export const isHolder = (opItem: OpItem): opItem is OpHolder =>
  opItem.type === "holder";
export const isCertifier = (opItem: OpItem): opItem is OpCertifier =>
  opItem.type === "certifier";
export const isCredential = (opItem: OpItem): opItem is OpCredential =>
  opItem.type === "credential";
