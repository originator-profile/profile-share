import { Profile } from "../types/profile";
import { Dp, DpItem } from "../types/dp";

const dpItemTypes: DpItem["type"][] = [
  "website",
  "text",
  "visibleText",
  "html",
];

export const isDp = (profile: Profile): profile is Dp =>
  profile.item.some((item) =>
    dpItemTypes.includes(item.type as DpItem["type"])
  );
