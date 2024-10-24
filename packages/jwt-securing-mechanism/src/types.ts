import { JWTPayload, JWTVerifyResult } from "jose";
import { JWTInvalid, JOSEError } from "jose/errors";
import { OpVc } from "@originator-profile/model";
import {
  JwtVcDecodeFailed,
  JwtVcValidateFailed,
  JwtVcVerifyFailed,
} from "./errors";

export type JwtVcDecodingResult<T extends OpVc> =
  | ({ payload: T & JWTPayload } & {
      jwt: string;
      error?: JWTInvalid;
    })
  | JwtVcDecodeFailed<T>
  | JwtVcValidateFailed<T>;

export type JwtVcVerificationResult<T extends OpVc> =
  | (Omit<JWTVerifyResult<T>, "protectedHeader"> & {
      jwt: string;
      error?: JOSEError;
    })
  | JwtVcDecodeFailed<T>
  | JwtVcValidateFailed<T>
  | JwtVcVerifyFailed<T>;
