import { Role } from "../types/role";

export const toRoles = (
  subject: string,
  advertisers: string[],
  main: string[]
): Role[] =>
  [
    advertisers.includes(subject) ? ["advertiser" as const] : [],
    main.includes(subject) ? ["main" as const] : [],
  ].flat();
