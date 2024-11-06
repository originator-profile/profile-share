import { generateKey } from "@originator-profile/cryptography";
import {
  JwtVcDecodeFailed,
  signVc,
} from "@originator-profile/jwt-securing-mechanism";
import {
  Certificate,
  CoreProfile,
  OpVc,
  OriginatorProfileSet,
  WebMediaProfile,
} from "@originator-profile/model";
import { signCp } from "@originator-profile/sign";
import { addYears, getUnixTime } from "date-fns";
import { diffApply } from "just-diff-apply";
import { describe, expect, test } from "vitest";
import { decodeOps } from "./decode-ops";
import { OpInvalid, OpsInvalid, OpsVerifyFailed } from "./errors";

const issuedAt = new Date();
const expiredAt = addYears(new Date(), 10);
const signOptions = { issuedAt, expiredAt };
const toVerifyResult = (vc: OpVc, jwt: string) => ({
  payload: {
    ...vc,
    iss: vc.issuer,
    sub: vc.credentialSubject.id,
    iat: getUnixTime(issuedAt),
    exp: getUnixTime(expiredAt),
  },
  jwt,
});
const patch = <T extends object>(...args: Parameters<typeof diffApply<T>>) => {
  const [source, diff] = args;
  const patched = structuredClone(source);
  diffApply(patched, diff);
  return patched;
};
const opId = {
  authority: "dns:cp-issuer.example.org" as const,
  certifier: "dns:pa-issuer.example.org" as const,
  holder: "dns:op-holder.example.org" as const,
};
const cp: CoreProfile = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
  ],
  type: ["VerifiableCredential", "CoreProfile"],
  issuer: opId.authority,
  credentialSubject: {
    id: opId.holder,
    type: "Core",
    jwks: {
      keys: [],
    },
  },
};
const certificate: Certificate = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    {
      "@language": "ja",
    },
  ],
  type: ["VerifiableCredential", "Certificate"],
  issuer: opId.certifier,
  credentialSubject: {
    id: opId.holder,
    type: "CertificateProperties",
    description: "Example Certificate",
    certificationSystem: {
      id: "urn:uuid:de5d6e80-10a5-404f-b4d3-e9f0e6926a21",
      type: "CertificationSystem",
      name: "Example Certification System",
      description: "Example Certification System Description",
    },
  },
};
const wmp: WebMediaProfile = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    {
      "@language": "ja",
    },
  ],
  type: ["VerifiableCredential", "WebMediaProfile"],
  issuer: opId.authority,
  credentialSubject: {
    id: opId.holder,
    type: "OnlineBusiness",
    name: "Example OP Holder",
    url: "https://op-holder.example.org/",
  },
};

describe("OPSの復号", async () => {
  const authority = await generateKey();
  const certifier = await generateKey();

  const authorityCp: CoreProfile = patch(cp, [
    {
      op: "replace",
      path: ["credentialSubject", "id"],
      value: opId.authority,
    },
    {
      op: "add",
      path: ["credentialSubject", "jwks", "keys", 0],
      value: authority.publicKey,
    },
  ]);
  const certifierCp: CoreProfile = patch(cp, [
    {
      op: "replace",
      path: ["credentialSubject", "id"],
      value: opId.certifier,
    },
    {
      op: "add",
      path: ["credentialSubject", "jwks", "keys", 0],
      value: certifier.publicKey,
    },
  ]);

  const authorityOp = {
    core: await signCp(authorityCp, authority.privateKey, signOptions),
  };
  const certifierOp = {
    core: await signCp(certifierCp, authority.privateKey, signOptions),
  };
  const holderOp = {
    core: await signCp(cp, authority.privateKey, signOptions),
    annotations: [await signVc(certificate, certifier.privateKey, signOptions)],
    media: await signVc(wmp, authority.privateKey, signOptions),
  };
  const ops: OriginatorProfileSet = [authorityOp, certifierOp, holderOp];

  test("OPSの復号に成功", async () => {
    const resultOps = decodeOps(ops);

    expect(resultOps).not.instanceOf(OpsInvalid);
    expect(resultOps).not.instanceOf(OpsVerifyFailed);
    expect(resultOps).toStrictEqual([
      {
        core: toVerifyResult(authorityCp, authorityOp.core),
        annotations: undefined,
        media: undefined,
      },
      {
        core: toVerifyResult(certifierCp, certifierOp.core),
        annotations: undefined,
        media: undefined,
      },
      {
        core: toVerifyResult(cp, holderOp.core),
        annotations: [toVerifyResult(certificate, holderOp.annotations[0])],
        media: toVerifyResult(wmp, holderOp.media),
      },
    ]);
  });

  test("CPの復号に失敗", async () => {
    const invalidOps = patch(ops, [
      { op: "replace", path: [2, "core"], value: "invalid" },
    ]);
    const resultOps = decodeOps(invalidOps);

    expect(resultOps).instanceOf(OpsInvalid);
    // @ts-expect-error invalid Ops
    const { result: resultOp } = resultOps;
    expect(resultOp[0]).toStrictEqual({
      core: toVerifyResult(authorityCp, authorityOp.core),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[1]).toStrictEqual({
      core: toVerifyResult(certifierCp, certifierOp.core),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[2]).instanceOf(OpInvalid);
    expect(resultOp[2].result.core).instanceOf(JwtVcDecodeFailed);
    expect(resultOp[2].result.annotations[0]).toStrictEqual(
      toVerifyResult(certificate, holderOp.annotations[0]),
    );
    expect(resultOp[2].result.media).toStrictEqual(
      toVerifyResult(wmp, holderOp.media),
    );
  });

  test("PAの復号に失敗", async () => {
    const invalidOps = patch(ops, [
      { op: "replace", path: [2, "annotations", 0], value: "invalid" },
    ]);
    const resultOps = decodeOps(invalidOps);

    expect(resultOps).instanceOf(OpsInvalid);
    // @ts-expect-error invalid Ops
    const { result: resultOp } = resultOps;
    expect(resultOp[0]).toStrictEqual({
      core: toVerifyResult(authorityCp, authorityOp.core),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[1]).toStrictEqual({
      core: toVerifyResult(certifierCp, certifierOp.core),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[2]).instanceOf(OpInvalid);
    expect(resultOp[2].result.core).toStrictEqual(
      toVerifyResult(cp, holderOp.core),
    );
    expect(resultOp[2].result.annotations[0]).instanceOf(JwtVcDecodeFailed);
    expect(resultOp[2].result.media).toStrictEqual(
      toVerifyResult(wmp, holderOp.media),
    );
  });

  test("WMPの復号に失敗", async () => {
    const invalidOps = patch(ops, [
      { op: "replace", path: [2, "media"], value: "invalid" },
    ]);
    const resultOps = decodeOps(invalidOps);

    expect(resultOps).instanceOf(OpsInvalid);
    // @ts-expect-error invalid Ops
    const { result: resultOp } = resultOps;
    expect(resultOp[0]).toStrictEqual({
      core: toVerifyResult(authorityCp, authorityOp.core),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[1]).toStrictEqual({
      core: toVerifyResult(certifierCp, certifierOp.core),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[2]).instanceOf(OpInvalid);
    expect(resultOp[2].result.core).toStrictEqual(
      toVerifyResult(cp, holderOp.core),
    );
    expect(resultOp[2].result.annotations[0]).toStrictEqual(
      toVerifyResult(certificate, holderOp.annotations[0]),
    );
    expect(resultOp[2].result.media).instanceOf(JwtVcDecodeFailed);
  });
});
