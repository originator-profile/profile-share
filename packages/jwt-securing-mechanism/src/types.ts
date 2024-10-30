import { JWTPayload, JWTVerifyResult } from "jose";
import { OpVc } from "@originator-profile/model";
import {
  JwtVcDecodeFailed,
  JwtVcValidateFailed,
  JwtVcVerifyFailed,
} from "./errors";

export type JwtVcDecodingResultPayload<T extends OpVc> = {
  payload: T & JWTPayload;
  jwt: string;
};

export type JwtVcDecodingResult<T extends OpVc> =
  | JwtVcDecodingResultPayload<T>
  | JwtVcDecodeFailed<T>
  | JwtVcValidateFailed<T>;

export type JwtVcVerificationResultPayload<T extends OpVc> = Omit<
  JWTVerifyResult<T>,
  "protectedHeader"
> & {
  jwt: string;
};

export type JwtVcVerificationResult<T extends OpVc> =
  | JwtVcVerificationResultPayload<T>
  | Extract<JwtVcDecodingResult<T>, Error>
  | JwtVcVerifyFailed<T>;
