import { describe, test, expect } from "vitest";
import { addYears, getUnixTime } from "date-fns";
import { diffApply } from "just-diff-apply";
import { generateKey, LocalKeys } from "@originator-profile/cryptography";
import {
  OriginatorProfileSet,
  CoreProfile,
  Certificate,
  WebMediaProfile,
  OpVc,
} from "@originator-profile/model";
import { signCp } from "@originator-profile/sign";
import {
  signVc,
  JwtVcVerifyFailed,
} from "@originator-profile/jwt-securing-mechanism";
import { OpsVerifier } from "./verify-ops";
import {
  OpsInvalid,
  OpsVerifyFailed,
  OpVerifyFailed,
  OpInvalid,
  CoreProfileNotFound,
} from "./errors";

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
  invalid: "dns:invalid.example.org" as const,
};
const cp: CoreProfile = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    {
      "@language": "ja",
    },
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
    annotations: [await signVc(certificate, certifier.privateKey, signOptions)],
    media: await signVc(wmp, authority.privateKey, signOptions),
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
      core: toVerifyResult(authorityCp, authorityOp.core),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[1]).toStrictEqual({
      core: toVerifyResult(certifierCp, certifierOp.core),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[2]).instanceOf(OpVerifyFailed);
    expect(resultOp[2].result.core).instanceOf(JwtVcVerifyFailed);
    expect(resultOp[2].result.annotations[0]).toStrictEqual(
      toVerifyResult(certificate, holderOp.annotations[0]),
    );
    expect(resultOp[2].result.media).toStrictEqual(
      toVerifyResult(wmp, holderOp.media),
    );
  });

  test("PAの署名の検証に失敗", async () => {
    const evil = await generateKey();
    const evilPa = await signVc(certificate, evil.privateKey, signOptions);
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
      core: toVerifyResult(authorityCp, authorityOp.core),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[1]).toStrictEqual({
      core: toVerifyResult(certifierCp, certifierOp.core),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[2]).instanceOf(OpVerifyFailed);
    expect(resultOp[2].result.core).toStrictEqual(
      toVerifyResult(cp, holderOp.core),
    );
    expect(resultOp[2].result.annotations[0]).toStrictEqual(
      toVerifyResult(certificate, holderOp.annotations[0]),
    );
    expect(resultOp[2].result.annotations[1]).instanceOf(JwtVcVerifyFailed);
    expect(resultOp[2].result.media).toStrictEqual(
      toVerifyResult(wmp, holderOp.media),
    );
  });

  test("WMPの署名の検証に失敗", async () => {
    const evil = await generateKey();
    const evilWmp = await signVc(wmp, evil.privateKey, signOptions);
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
      core: toVerifyResult(authorityCp, authorityOp.core),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[1]).toStrictEqual({
      core: toVerifyResult(certifierCp, certifierOp.core),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[2]).instanceOf(OpVerifyFailed);
    expect(resultOp[2].result.core).toStrictEqual(
      toVerifyResult(cp, holderOp.core),
    );
    expect(resultOp[2].result.annotations[0]).toStrictEqual(
      toVerifyResult(certificate, holderOp.annotations[0]),
    );
    expect(resultOp[2].result.media).instanceOf(JwtVcVerifyFailed);
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
      core: toVerifyResult(authorityCp, authorityOp.core),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[1]).toStrictEqual({
      core: toVerifyResult(certifierCp, certifierOp.core),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[2]).instanceOf(OpVerifyFailed);
    expect(resultOp[2].result.core).instanceOf(JwtVcVerifyFailed);
    expect(resultOp[2].result.annotations[0]).toStrictEqual(
      toVerifyResult(certificate, holderOp.annotations[0]),
    );
    expect(resultOp[2].result.media).toStrictEqual(
      toVerifyResult(wmp, holderOp.media),
    );
  });

  test("CPとWMPの保有者が不一致", async () => {
    const invalidWmp = await signVc(
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
    const invalidPa = await signVc(
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
        core: toVerifyResult(certifierCp, certifierOp.core),
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
      core: toVerifyResult(authorityCp, authorityOp.core),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[1]).instanceOf(OpVerifyFailed);
    expect(resultOp[1].result.core).toStrictEqual(
      toVerifyResult(cp, holderOp.core),
    );
    expect(resultOp[1].result.annotations[0]).instanceOf(CoreProfileNotFound);
    expect(resultOp[1].result.media).toStrictEqual(
      toVerifyResult(wmp, holderOp.media),
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
      core: toVerifyResult(certifierCp, certifierOp.core),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOp[1]).instanceOf(OpVerifyFailed);
    expect(resultOp[1].result.core).toStrictEqual(
      toVerifyResult(cp, holderOp.core),
    );
    expect(resultOp[1].result.annotations[0]).toStrictEqual(
      toVerifyResult(certificate, holderOp.annotations[0]),
    );
    expect(resultOp[1].result.media).instanceOf(CoreProfileNotFound);
  });
});
