import { Role } from "../types/role";

export const toRoles = (
  subject: string,
  advertisers: string[],
  publisher: string[]
): Role[] =>
  [
    advertisers.includes(subject) ? ["advertiser" as const] : [],
    publisher.includes(subject) ? ["publisher" as const] : [],
  ].flat();
