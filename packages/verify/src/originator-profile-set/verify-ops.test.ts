import { generateKey, LocalKeys } from "@originator-profile/cryptography";
import {
  VcVerifyFailed,
  UnverifiedJwtVc,
  VerifiedJwtVc,
  signJwtVc,
} from "@originator-profile/securing-mechanism";
import {
  Certificate,
  CoreProfile,
  OpVc,
  OriginatorProfileSet,
  WebMediaProfile,
  Jwk,
} from "@originator-profile/model";
import { signCp } from "@originator-profile/sign";
import { addYears, getUnixTime, fromUnixTime } from "date-fns";
import { diffApply } from "just-diff-apply";
import { describe, expect, test } from "vitest";
import {
  CoreProfileNotFound,
  OpInvalid,
  OpsInvalid,
  OpsVerifyFailed,
  OpVerifyFailed,
} from "./errors";
import { OpsVerifier } from "./verify-ops";

const issuedAt = fromUnixTime(getUnixTime(new Date()));
const expiredAt = addYears(issuedAt, 10);
const signOptions = { issuedAt, expiredAt };
const toVerifyResult = (
  vc: OpVc,
  jwt: string,
  verificationKey?: Jwk,
): UnverifiedJwtVc<OpVc> | VerifiedJwtVc<OpVc> => {
  const unverified = {
    doc: vc,
    issuedAt,
    expiredAt,
    algorithm: "ES256",
    mediaType: "application/vc+jwt",
    source: jwt,
  };
  if (verificationKey)
    return { ...unverified, verificationKey, validated: false };
  return unverified;
};
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
  invalid: "dns:invalid.example.org" as const,
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

describe("OPSの検証", async () => {
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
    annotations: [
      await signJwtVc(certificate, certifier.privateKey, signOptions),
    ],
    media: await signJwtVc(wmp, authority.privateKey, signOptions),
  };
  const ops: OriginatorProfileSet = [authorityOp, certifierOp, holderOp];

  test("OPSの検証に成功", async () => {
    const verify = OpsVerifier(
      ops,
      LocalKeys({ keys: [authority.publicKey] }),
      opId.authority,
    );
    const resultOps = await verify();

    expect(resultOps).not.instanceOf(OpsInvalid);
    expect(resultOps).not.instanceOf(OpsVerifyFailed);
    expect(resultOps).toStrictEqual([
      {
        core: toVerifyResult(
          authorityCp,
          authorityOp.core,
          authority.publicKey,
        ),
        annotations: undefined,
        media: undefined,
      },
      {
        core: toVerifyResult(
          certifierCp,
          certifierOp.core,
          authority.publicKey,
        ),
        annotations: undefined,
        media: undefined,
      },
      {
        core: toVerifyResult(cp, holderOp.core, authority.publicKey),
        annotations: [
          toVerifyResult(
            certificate,
            holderOp.annotations[0],
            certifier.publicKey,
          ),
        ],
        media: toVerifyResult(wmp, holderOp.media, authority.publicKey),
      },
    ]);
  });

  test("CPの署名の検証に失敗", async () => {
    const evil = await generateKey();
    const evilCp = await signCp(cp, evil.privateKey, signOptions);
    const evilOps: OriginatorProfileSet = patch(ops, [
      {
        op: "replace",
        path: [2, "core"],
        value: evilCp,
      },
    ]);
    const verify = OpsVerifier(
      evilOps,
      LocalKeys({ keys: [authority.publicKey] }),
      opId.authority,
    );
    const resultOps = await verify();

    expect(resultOps).not.instanceOf(OpsInvalid);
    expect(resultOps).instanceOf(OpsVerifyFailed);
    // @ts-expect-error verify failed Ops
    const { result: resultOp } = resultOps;
    expect(resultOp[0]).toStrictEqual({
      core: toVerifyResult(authorityCp, authorityOp.core, authority.publicKey),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[1]).toStrictEqual({
      core: toVerifyResult(certifierCp, certifierOp.core, authority.publicKey),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[2]).instanceOf(OpVerifyFailed);
    expect(resultOp[2].result.core).instanceOf(VcVerifyFailed);
    expect(resultOp[2].result.annotations[0]).toStrictEqual(
      toVerifyResult(certificate, holderOp.annotations[0], certifier.publicKey),
    );
    expect(resultOp[2].result.media).toStrictEqual(
      toVerifyResult(wmp, holderOp.media, authority.publicKey),
    );
  });

  test("PAの署名の検証に失敗", async () => {
    const evil = await generateKey();
    const evilPa = await signJwtVc(certificate, evil.privateKey, signOptions);
    const evilOps: OriginatorProfileSet = patch(ops, [
      {
        op: "add",
        path: [2, "annotations", 1],
        value: evilPa,
      },
    ]);
    const verify = OpsVerifier(
      evilOps,
      LocalKeys({ keys: [authority.publicKey] }),
      opId.authority,
    );
    const resultOps = await verify();

    expect(resultOps).not.instanceOf(OpsInvalid);
    expect(resultOps).instanceOf(OpsVerifyFailed);
    // @ts-expect-error verify failed Ops
    const { result: resultOp } = resultOps;
    expect(resultOp[0]).toStrictEqual({
      core: toVerifyResult(authorityCp, authorityOp.core, authority.publicKey),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[1]).toStrictEqual({
      core: toVerifyResult(certifierCp, certifierOp.core, authority.publicKey),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[2]).instanceOf(OpVerifyFailed);
    expect(resultOp[2].result.core).toStrictEqual(
      toVerifyResult(cp, holderOp.core, authority.publicKey),
    );
    expect(resultOp[2].result.annotations[0]).toStrictEqual(
      toVerifyResult(certificate, holderOp.annotations[0], certifier.publicKey),
    );
    expect(resultOp[2].result.annotations[1]).instanceOf(VcVerifyFailed);
    expect(resultOp[2].result.media).toStrictEqual(
      toVerifyResult(wmp, holderOp.media, authority.publicKey),
    );
  });

  test("WMPの署名の検証に失敗", async () => {
    const evil = await generateKey();
    const evilWmp = await signJwtVc(wmp, evil.privateKey, signOptions);
    const evilOps: OriginatorProfileSet = patch(ops, [
      {
        op: "replace",
        path: [2, "media"],
        value: evilWmp,
      },
    ]);
    const verify = OpsVerifier(
      evilOps,
      LocalKeys({ keys: [authority.publicKey] }),
      opId.authority,
    );
    const resultOps = await verify();

    expect(resultOps).not.instanceOf(OpsInvalid);
    expect(resultOps).instanceOf(OpsVerifyFailed);
    // @ts-expect-error verify failed Ops
    const { result: resultOp } = resultOps;
    expect(resultOp[0]).toStrictEqual({
      core: toVerifyResult(authorityCp, authorityOp.core, authority.publicKey),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[1]).toStrictEqual({
      core: toVerifyResult(certifierCp, certifierOp.core, authority.publicKey),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[2]).instanceOf(OpVerifyFailed);
    expect(resultOp[2].result.core).toStrictEqual(
      toVerifyResult(cp, holderOp.core, authority.publicKey),
    );
    expect(resultOp[2].result.annotations[0]).toStrictEqual(
      toVerifyResult(certificate, holderOp.annotations[0], certifier.publicKey),
    );
    expect(resultOp[2].result.media).instanceOf(VcVerifyFailed);
  });

  test("CPの発行者と署名者が不一致", async () => {
    const evilCp = await signCp(
      patch(cp, [{ op: "replace", path: ["issuer"], value: opId.invalid }]),
      authority.privateKey,
      signOptions,
    );
    const evilOps: OriginatorProfileSet = patch(ops, [
      {
        op: "replace",
        path: [2, "core"],
        value: evilCp,
      },
    ]);
    const verify = OpsVerifier(
      evilOps,
      LocalKeys({ keys: [authority.publicKey] }),
      opId.authority,
    );
    const resultOps = await verify();

    expect(resultOps).not.instanceOf(OpsInvalid);
    expect(resultOps).instanceOf(OpsVerifyFailed);
    // @ts-expect-error verify failed Ops
    const { result: resultOp } = resultOps;
    expect(resultOp[0]).toStrictEqual({
      core: toVerifyResult(authorityCp, authorityOp.core, authority.publicKey),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[1]).toStrictEqual({
      core: toVerifyResult(certifierCp, certifierOp.core, authority.publicKey),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[2]).instanceOf(OpVerifyFailed);
    expect(resultOp[2].result.core).instanceOf(VcVerifyFailed);
    expect(resultOp[2].result.annotations[0]).toStrictEqual(
      toVerifyResult(certificate, holderOp.annotations[0], certifier.publicKey),
    );
    expect(resultOp[2].result.media).toStrictEqual(
      toVerifyResult(wmp, holderOp.media, authority.publicKey),
    );
  });

  test("CPとWMPの保有者が不一致", async () => {
    const invalidWmp = await signJwtVc(
      patch(wmp, [
        {
          op: "replace",
          path: ["credentialSubject", "id"],
          value: opId.invalid,
        },
      ]),
      authority.privateKey,
      signOptions,
    );
    const invalidOps = patch(ops, [
      {
        op: "replace",
        path: [2, "media"],
        value: invalidWmp,
      },
    ]);
    const verify = OpsVerifier(
      invalidOps,
      LocalKeys({ keys: [authority.publicKey] }),
      opId.authority,
    );
    const resultOps = await verify();

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
  });

  test("CPとPAの保有者が不一致", async () => {
    const invalidPa = await signJwtVc(
      patch(certificate, [
        {
          op: "replace",
          path: ["credentialSubject", "id"],
          value: opId.invalid,
        },
      ]),
      authority.privateKey,
      signOptions,
    );
    const evilOps: OriginatorProfileSet = patch(ops, [
      {
        op: "add",
        path: [2, "annotations", 1],
        value: invalidPa,
      },
    ]);
    const verify = OpsVerifier(
      evilOps,
      LocalKeys({ keys: [authority.publicKey] }),
      opId.authority,
    );
    const resultOps = await verify();

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
  });

  test("CP発行者のOPがOPSに存在しなくても検証に成功", async () => {
    const verify = OpsVerifier(
      [certifierOp],
      LocalKeys({ keys: [authority.publicKey] }),
      opId.authority,
    );
    const resultOps = await verify();

    expect(resultOps).not.instanceOf(OpsInvalid);
    expect(resultOps).not.instanceOf(OpsVerifyFailed);
    expect(resultOps).toStrictEqual([
      {
        core: toVerifyResult(
          certifierCp,
          certifierOp.core,
          authority.publicKey,
        ),
        annotations: undefined,
        media: undefined,
      },
    ]);
  });

  test("PA発行者のOPがOPSに存在しない", async () => {
    const invalidOps: OriginatorProfileSet = [authorityOp, holderOp];
    const verify = OpsVerifier(
      invalidOps,
      LocalKeys({ keys: [authority.publicKey] }),
      opId.authority,
    );
    const resultOps = await verify();

    expect(resultOps).not.instanceOf(OpsInvalid);
    expect(resultOps).instanceOf(OpsVerifyFailed);
    // @ts-expect-error verify failed Ops
    const { result: resultOp } = resultOps;
    expect(resultOp[0]).toStrictEqual({
      core: toVerifyResult(authorityCp, authorityOp.core, authority.publicKey),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[1]).instanceOf(OpVerifyFailed);
    expect(resultOp[1].result.core).toStrictEqual(
      toVerifyResult(cp, holderOp.core, authority.publicKey),
    );
    expect(resultOp[1].result.annotations[0]).instanceOf(CoreProfileNotFound);
    expect(resultOp[1].result.media).toStrictEqual(
      toVerifyResult(wmp, holderOp.media, authority.publicKey),
    );
  });

  test("WMP発行者のOPがOPSに存在しない", async () => {
    const invalidOps: OriginatorProfileSet = [certifierOp, holderOp];
    const verify = OpsVerifier(
      invalidOps,
      LocalKeys({ keys: [authority.publicKey] }),
      opId.authority,
    );
    const resultOps = await verify();

    expect(resultOps).not.instanceOf(OpsInvalid);
    expect(resultOps).instanceOf(OpsVerifyFailed);
    // @ts-expect-error verify failed Ops
    const { result: resultOp } = resultOps;
    expect(resultOp[0]).toStrictEqual({
      core: toVerifyResult(certifierCp, certifierOp.core, authority.publicKey),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[1]).instanceOf(OpVerifyFailed);
    expect(resultOp[1].result.core).toStrictEqual(
      toVerifyResult(cp, holderOp.core, authority.publicKey),
    );
    expect(resultOp[1].result.annotations[0]).toStrictEqual(
      toVerifyResult(certificate, holderOp.annotations[0], certifier.publicKey),
    );
    expect(resultOp[1].result.media).instanceOf(CoreProfileNotFound);
  });
});
