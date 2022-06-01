import { Role } from "../types/role";

export const toRoles = (
  subject: string,
  advertisers: string[],
  publishers: string[]
): Role[] =>
  [
    advertisers.includes(subject) ? ["advertiser" as const] : [],
    publishers.includes(subject) ? ["publisher" as const] : [],
  ].flat();
