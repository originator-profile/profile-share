import { TokenDecoder } from "./decode";
import { ProfilesVerifyFailed } from "./errors";
import { Keys, LocalKeys } from "./keys";
import { Profiles, VerifyResult, VerifyResults } from "./types";
import { TokenVerifier } from "./verify-token";

/**
 * Profiles Set の検証者の生成
 * @param profiles Profiles Set
 * @param registryKeys OPレジストリの公開鍵
 * @param registry OPレジストリ
 * @return 検証者
 */
export function ProfilesVerifier(
  profiles: Profiles,
  registryKeys: Keys,
  registry: string
) {
  const decoder = TokenDecoder();
  const opVerifier = TokenVerifier(registryKeys, registry, decoder);
  const decoded = profiles.profile.map(decoder);
  const verifiers = new Map<string, TokenVerifier>();
  verifiers.set(registry, opVerifier);

  for (const result of decoded.values()) {
    if (result instanceof Error) continue;
    if ("dp" in result) continue;

    const issuer = result.payload.iss;
    if (issuer !== registry) continue;

    const subject = result.payload.sub;
    if (verifiers.has(subject)) continue;

    const jwks = result.payload["https://opr.webdino.org/jwt/claims/op"].jwks;
    const keys = LocalKeys(jwks ?? { keys: [] });
    const verify = TokenVerifier(keys, issuer, decoder);
    verifiers.set(subject, verify);
  }

  /**
   * Profiles Set の検証
   * @return 検証結果
   */
  async function verifyProfiles(): Promise<VerifyResults> {
    const results: Array<VerifyResult | Promise<VerifyResult>> = [];

    for (const result of decoded.values()) {
      if (result instanceof Error) {
        results.push(result);
        continue;
      }

      const issuer = result.payload.iss;
      const verifier = verifiers.get(issuer);
      if (verifier === undefined) {
        const error = new ProfilesVerifyFailed(
          "Profiles Verification Failed",
          result
        );
        results.push(error);
        continue;
      }

      results.push(verifier(result.jwt));
    }

    return await Promise.all(results);
  }

  return verifyProfiles;
}

export type ProfilesVerifier = ReturnType<typeof ProfilesVerifier>;
