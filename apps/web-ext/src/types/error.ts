import { JwtProfilePayload } from "./profile";

export type JwtVerifyError = {
  payload: JwtProfilePayload;
  error: Error;
};
