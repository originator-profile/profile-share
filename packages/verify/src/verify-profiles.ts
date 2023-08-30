import { JwtOpPayload, JwtDpPayload } from "@originator-profile/model";
import { SignedProfileValidator, TokenDecoder } from "./decode";
import {
  ProfileGenericError,
  ProfileClaimsValidationFailed,
  ProfilesVerifyFailed,
  ProfilesResolveFailed,
} from "./errors";
import { Keys, LocalKeys } from "./keys";
import {
  DecodeResult,
  VerifyTokenResult,
  Profiles,
  VerifyResult,
  VerifyResults,
} from "./types";
import { TokenVerifier } from "./verify-token";

function getToken(res: DecodeResult | VerifyTokenResult) {
  return res instanceof ProfileGenericError ? res.result.jwt : res.jwt;
}

type Token = ReturnType<typeof getToken>;

/**
 * Profile Set の検証者の生成
 * @todo Originator Profile のみでの検証を対応したい https://github.com/originator-profile/profile/issues/615
 * @param profiles Profile Set
 * @param registryKeys OPレジストリの公開鍵
 * @param registry OPレジストリ
 * @param validator ペイロード確認のためのバリデーター (null: 無効)
 * @return 検証者
 */
export function ProfilesVerifier(
  profiles: Profiles,
  registryKeys: Keys,
  registry: string,
  validator: SignedProfileValidator | null,
) {
  const results = new Map<Token | symbol, VerifyResult>();
  const decoder = TokenDecoder(validator);
  const opVerifier = TokenVerifier(registryKeys, registry, decoder);
  const opTokens: Array<{ op: true; payload: JwtOpPayload; jwt: string }> = [];
  const dpTokens: Array<{ dp: true; payload: JwtDpPayload; jwt: string }> = [];

  for (const token of profiles.profile) {
    const res = decoder(token);
    if (res instanceof ProfileClaimsValidationFailed) {
      results.set(token, res);
      continue;
    }
    if (results.has(token)) {
      const error = new ProfilesVerifyFailed("Duplicated token", res);
      results.set(token, error);
      results.set(Symbol(error.message), error);
      continue;
    }
    const pending = new ProfilesResolveFailed("Unresolved Profiles", res);
    results.set(token, pending);
    if ("dp" in res) dpTokens.push(res);
    if ("op" in res) opTokens.push(res);
  }

  for (const [i, op] of opTokens.entries()) {
    const exists = dpTokens.find((dp) => op.payload.sub === dp.payload.iss);
    if (exists) continue;
    const error = new ProfilesVerifyFailed("Document Profile is required", op);
    results.set(getToken(op), error);
    dpTokens.splice(i, 1);
  }

  /**
   * Profile Set の検証
   * @return 検証結果
   */
  async function verifyProfiles(): Promise<VerifyResults> {
    const opResults: Promise<VerifyTokenResult>[] = [];
    const dpResults: Promise<VerifyTokenResult>[] = [];

    opTokens
      .filter(({ payload }) => payload.iss === registry)
      .forEach(({ jwt }) => {
        opResults.push(opVerifier(jwt));
      });

    for (const res of await Promise.all(opResults)) {
      const token = getToken(res);
      if (results.get(token) instanceof ProfilesResolveFailed) {
        results.set(token, res);
      }
      if (res instanceof ProfileGenericError) continue;
      const subject = res.payload.sub ?? "";
      const jwks = "op" in res ? res.op.jwks : undefined;
      const keys = LocalKeys(jwks ?? { keys: [] });
      const dpVerifier = TokenVerifier(keys, subject, decoder);
      const verify = async (jwt: string) => {
        const dp = await dpVerifier(jwt);
        if (dp instanceof ProfileGenericError) {
          const error = new ProfilesVerifyFailed(
            "Document Profile is invalid",
            res,
          );
          results.set(token, error);
        }
        return dp;
      };

      dpTokens
        .filter(({ payload }) => payload.iss === subject)
        .forEach(({ jwt }) => {
          dpResults.push(verify(jwt));
        });
    }

    for (const res of await Promise.all(dpResults)) {
      const token = getToken(res);
      if (results.get(token) instanceof ProfilesResolveFailed) {
        results.set(token, res);
      }
    }

    return [...results.values()];
  }

  return verifyProfiles;
}

export type ProfilesVerifier = ReturnType<typeof ProfilesVerifier>;
