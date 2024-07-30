import {
  JSONWebKeySet,
  KeyLike,
  JWSHeaderParameters,
  FlattenedJWSInput,
} from "jose";
import { LocalKeys } from "./";

/**
 * Resolve public key from JWT VC Issuer Metadata Response
 * @param url JWT VC Issuer Metadata Response URL
 * @return Public key
 **/
export function JwtVcIssuerKeys(url: URL): ReturnType<typeof LocalKeys> {
  const jwtVcIssuerKeys = async (
    protectedHeader?: JWSHeaderParameters,
    token?: FlattenedJWSInput,
  ): Promise<KeyLike> => {
    const response: { jwks: JSONWebKeySet } = await fetch(url.href).then(
      (response) => response.json(),
    );
    return LocalKeys(response.jwks)(protectedHeader, token);
  };
  return jwtVcIssuerKeys;
}
