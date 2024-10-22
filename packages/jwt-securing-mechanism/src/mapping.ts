import { OpVc } from "@originator-profile/model";
import { JWTPayload } from "jose";

export function mapToVcDataModel(jwtPayload: JWTPayload) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { iss, iat, exp, sub, aud, jti, nbf, ...rest } = jwtPayload;
  // TODO: iss, sub の確認
  return rest;
}

export function mapToJwt<T extends OpVc>(vc: T) {
  return vc;
}
