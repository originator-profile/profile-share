import { generateKey, LocalKeys } from "@originator-profile/cryptography";
import {
  JwtVcVerifyFailed,
  signVc,
} from "@originator-profile/jwt-securing-mechanism";
import {
  Certificate,
  CoreProfile,
  OpVc,
  OriginatorProfileSet,
  SiteProfile,
  WebMediaProfile,
  WebsiteProfile,
} from "@originator-profile/model";
import { signCp } from "@originator-profile/sign";
import { addYears, getUnixTime } from "date-fns";
import { diffApply } from "just-diff-apply";
import { describe, expect, test } from "vitest";
import { SiteProfileInvalid, SiteProfileVerifyFailed } from "./verify-errors";
import {
  CoreProfileNotFound,
  OpVerifyFailed,
} from "../originator-profile-set/errors";
import { SpVerifier } from "./verify-site-profile";

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
const wsp: WebsiteProfile = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    {
      "@language": "ja",
    },
  ],
  type: ["VerifiableCredential", "WebsiteProfile"],
  issuer: opId.holder,
  credentialSubject: {
    id: opId.holder,
    type: "WebSite",
    name: "Example Website",
    description: "Example Website Description",
    url: "https://op-holder.example.org/",
  },
};

describe("Site Profileの検証", async () => {
  const authority = await generateKey();
  const certifier = await generateKey();
  const holder = await generateKey();

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
  const holderCp: CoreProfile = patch(cp, [
    {
      op: "add",
      path: ["credentialSubject", "jwks", "keys", 0],
      value: holder.publicKey,
    },
  ]);

  const authorityOp = {
    core: await signCp(authorityCp, authority.privateKey, signOptions),
  };
  const certifierOp = {
    core: await signCp(certifierCp, authority.privateKey, signOptions),
  };
  const holderOp = {
    core: await signCp(holderCp, authority.privateKey, signOptions),
    annotations: [await signVc(certificate, certifier.privateKey, signOptions)],
    media: await signVc(wmp, authority.privateKey, signOptions),
  };
  const ops: OriginatorProfileSet = [authorityOp, certifierOp, holderOp];
  const sp: SiteProfile = {
    originators: ops,
    credential: await signVc(wsp, holder.privateKey, signOptions),
  };

  test("SiteProfileの検証に成功", async () => {
    const verify = SpVerifier(
      sp,
      LocalKeys({ keys: [authority.publicKey] }),
      opId.authority,
    );
    const resultSp = await verify();

    expect(resultSp).not.instanceOf(SiteProfileInvalid);
    expect(resultSp).not.instanceOf(SiteProfileVerifyFailed);
    expect(resultSp).toStrictEqual({
      originators: [
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
          core: toVerifyResult(holderCp, holderOp.core),
          annotations: [toVerifyResult(certificate, holderOp.annotations[0])],
          media: toVerifyResult(wmp, holderOp.media),
        },
      ],
      credential: toVerifyResult(wsp, sp.credential),
    });
  });

  test("SiteProfileののうちOPS部分の署名の検証に失敗", async () => {
    const evil = await generateKey();
    const evilCp = await signCp(cp, evil.privateKey, signOptions);
    const evilOps: OriginatorProfileSet = patch(ops, [
      {
        op: "replace",
        path: [2, "core"],
        value: evilCp,
      },
    ]);
    const evilSp = {
      originators: evilOps,
      credential: await signVc(wsp, evil.privateKey, signOptions),
    };
    const verify = SpVerifier(
      evilSp,
      LocalKeys({ keys: [authority.publicKey] }),
      opId.authority,
    );
    const resultSp = await verify();

    expect(resultSp).not.instanceOf(SiteProfileInvalid);
    expect(resultSp).instanceOf(SiteProfileVerifyFailed);
    // @ts-expect-error verify failed Sp
    const { result: resultOp } = resultSp.result.originators;
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

  test("SiteProfileのうちWSP部分の署名の検証に失敗", async () => {
    const evil = await generateKey();
    const evilWsp = await signVc(wsp, evil.privateKey, signOptions);
    const evilSp = {
      originators: ops,
      credential: evilWsp,
    };
    const verify = SpVerifier(
      evilSp,
      LocalKeys({ keys: [authority.publicKey] }),
      opId.authority,
    );
    const resultSp = await verify();

    expect(resultSp).not.instanceOf(SiteProfileInvalid);
    expect(resultSp).instanceOf(SiteProfileVerifyFailed);
    // @ts-expect-error verify failed Sp
    const { originators: resultOps, credential: resultWsp } = resultSp.result;
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
        core: toVerifyResult(holderCp, holderOp.core),
        annotations: [toVerifyResult(certificate, holderOp.annotations[0])],
        media: toVerifyResult(wmp, holderOp.media),
      },
    ]);
    expect(resultWsp).instanceOf(JwtVcVerifyFailed);
  });

  test("WSPのイシュアーと一致する保有者のCPがない", async () => {
    const invalidWsp = patch(wsp, [
      {
        op: "replace",
        path: ["issuer"],
        value: opId.invalid,
      },
    ]);
    const invalidCredential = await signVc(
      invalidWsp,
      holder.privateKey,
      signOptions,
    );
    const invalidSp = patch(sp, [
      {
        op: "replace",
        path: ["credential"],
        value: invalidCredential,
      },
    ]);
    const verify = SpVerifier(
      invalidSp,
      LocalKeys({ keys: [authority.publicKey] }),
      opId.authority,
    );
    const resultSp = await verify();

    expect(resultSp).instanceOf(SiteProfileInvalid);
    // @ts-expect-error invalid Sp
    const { originators: resultOps, credential: resultWsp } = resultSp.result;
    console.log(JSON.stringify(resultOps, null, 2));
    expect(resultOps[0]).toStrictEqual({
      core: toVerifyResult(authorityCp, authorityOp.core),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOps[1]).toStrictEqual({
      core: toVerifyResult(certifierCp, certifierOp.core),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOps[2]).toStrictEqual({
      core: toVerifyResult(holderCp, holderOp.core),
      annotations: [toVerifyResult(certificate, holderOp.annotations[0])],
      media: toVerifyResult(wmp, holderOp.media),
    });
    expect(resultWsp).instanceOf(CoreProfileNotFound);
  });
});
