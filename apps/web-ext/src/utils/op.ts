import { Profile } from "../types/profile";
import { Op, OpItem } from "../types/op";

const opItemTypes: OpItem["type"][] = ["holder", "certifier", "credential"];

export const isOp = (profile: Profile): profile is Op =>
  profile.item.some((item) =>
    opItemTypes.includes(item.type as OpItem["type"])
  );
