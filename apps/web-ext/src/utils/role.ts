import { Role } from "../types/role";

export const toRoles = (
  subject: string,
  advertisers: string[],
  mains: string[]
): Role[] =>
  [
    advertisers.includes(subject) ? ["advertiser" as const] : [],
    mains.includes(subject) ? ["main" as const] : [],
  ].flat();
