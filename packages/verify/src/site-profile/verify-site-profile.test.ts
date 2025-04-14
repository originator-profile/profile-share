import { generateKey, LocalKeys } from "@originator-profile/cryptography";
import {
  VcVerifyFailed,
  VerifiedJwtVc,
  signJwtVc,
} from "@originator-profile/securing-mechanism";
import {
  Certificate,
  CoreProfile,
  OpVc,
  OriginatorProfileSet,
  SiteProfile,
  WebMediaProfile,
  WebsiteProfile,
  Jwk,
} from "@originator-profile/model";
import { signCp } from "@originator-profile/sign";
import { addYears, fromUnixTime, getUnixTime } from "date-fns";
import { diffApply } from "just-diff-apply";
import { describe, expect, test } from "vitest";
import { SiteProfileInvalid, SiteProfileVerifyFailed } from "./verify-errors";
import {
  CoreProfileNotFound,
  OpVerifyFailed,
} from "../originator-profile-set/errors";
import { SpVerifier } from "./verify-site-profile";

const issuedAt = fromUnixTime(getUnixTime(new Date()));
const expiredAt = addYears(issuedAt, 10);
const signOptions = { issuedAt, expiredAt };
const toVerifyResult = (
  vc: OpVc,
  jwt: string,
  verificationKey: Jwk,
): VerifiedJwtVc<OpVc> => ({
  doc: vc,
  issuedAt,
  expiredAt,
  algorithm: "ES256",
  mediaType: "application/vc+jwt",
  source: jwt,
  verificationKey,
  validated: false,
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
    url: "https://op-holder.example.org",
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
    annotations: [
      await signJwtVc(certificate, certifier.privateKey, signOptions),
    ],
    media: await signJwtVc(wmp, authority.privateKey, signOptions),
  };
  const ops: OriginatorProfileSet = [authorityOp, certifierOp, holderOp];
  const sp: SiteProfile = {
    originators: ops,
    credential: await signJwtVc(wsp, holder.privateKey, signOptions),
  };

  test("SiteProfileの検証に成功", async () => {
    const verify = SpVerifier(
      sp,
      LocalKeys({ keys: [authority.publicKey] }),
      opId.authority,
      "https://op-holder.example.org",
    );
    const resultSp = await verify();

    expect(resultSp).not.instanceOf(SiteProfileInvalid);
    expect(resultSp).not.instanceOf(SiteProfileVerifyFailed);
    expect(resultSp).toStrictEqual({
      originators: [
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
          core: toVerifyResult(holderCp, holderOp.core, authority.publicKey),
          annotations: [
            toVerifyResult(
              certificate,
              holderOp.annotations[0],
              certifier.publicKey,
            ),
          ],
          media: toVerifyResult(wmp, holderOp.media, authority.publicKey),
        },
      ],
      credential: toVerifyResult(wsp, sp.credential, holder.publicKey),
    });
  });

  test("SiteProfileの検証に成功(origin部分は検証しない)", async () => {
    const verify = SpVerifier(
      sp,
      LocalKeys({ keys: [authority.publicKey] }),
      opId.authority,
      "https://not-exisiting.example.org",
      false,
    );
    const resultSp = await verify();

    expect(resultSp).not.instanceOf(SiteProfileInvalid);
    expect(resultSp).not.instanceOf(SiteProfileVerifyFailed);
    expect(resultSp).toStrictEqual({
      originators: [
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
          core: toVerifyResult(holderCp, holderOp.core, authority.publicKey),
          annotations: [
            toVerifyResult(
              certificate,
              holderOp.annotations[0],
              certifier.publicKey,
            ),
          ],
          media: toVerifyResult(wmp, holderOp.media, authority.publicKey),
        },
      ],
      credential: toVerifyResult(wsp, sp.credential, holder.publicKey),
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
      credential: await signJwtVc(wsp, evil.privateKey, signOptions),
    };
    const verify = SpVerifier(
      evilSp,
      LocalKeys({ keys: [authority.publicKey] }),
      opId.authority,
      "https://op-holder.example.org",
    );
    const resultSp = await verify();

    expect(resultSp).not.instanceOf(SiteProfileInvalid);
    expect(resultSp).instanceOf(SiteProfileVerifyFailed);
    // @ts-expect-error verify failed Sp
    const { result: resultOp } = resultSp.result.originators;
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

  test("SiteProfileのうちWSP部分の署名の検証に失敗", async () => {
    const evil = await generateKey();
    const evilWsp = await signJwtVc(wsp, evil.privateKey, signOptions);
    const evilSp = {
      originators: ops,
      credential: evilWsp,
    };
    const verify = SpVerifier(
      evilSp,
      LocalKeys({ keys: [authority.publicKey] }),
      opId.authority,
      "https://op-holder.example.org",
    );
    const resultSp = await verify();

    expect(resultSp).not.instanceOf(SiteProfileInvalid);
    expect(resultSp).instanceOf(SiteProfileVerifyFailed);
    // @ts-expect-error verify failed Sp
    const { originators: resultOps, credential: resultWsp } = resultSp.result;
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
        core: toVerifyResult(holderCp, holderOp.core, authority.publicKey),
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
    expect(resultWsp).instanceOf(VcVerifyFailed);
  });

  test("WSPのイシュアーと一致する保有者のCPがない", async () => {
    const invalidWsp = patch(wsp, [
      {
        op: "replace",
        path: ["issuer"],
        value: opId.invalid,
      },
    ]);
    const invalidCredential = await signJwtVc(
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
      "https://op-holder.example.org",
    );
    const resultSp = await verify();

    expect(resultSp).instanceOf(SiteProfileInvalid);
    // @ts-expect-error invalid Sp
    const { originators: resultOps, credential: resultWsp } = resultSp.result;
    expect(resultOps[0]).toStrictEqual({
      core: toVerifyResult(authorityCp, authorityOp.core, authority.publicKey),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOps[1]).toStrictEqual({
      core: toVerifyResult(certifierCp, certifierOp.core, authority.publicKey),
      annotations: undefined,
      media: undefined,
    });
    expect(resultOps[2]).toStrictEqual({
      core: toVerifyResult(holderCp, holderOp.core, authority.publicKey),
      annotations: [
        toVerifyResult(
          certificate,
          holderOp.annotations[0],
          certifier.publicKey,
        ),
      ],
      media: toVerifyResult(wmp, holderOp.media, authority.publicKey),
    });
    expect(resultWsp).instanceOf(CoreProfileNotFound);
  });

  test("WSPのURLとオリジンが一致しない時に検証に失敗するか", async () => {
    const verify = SpVerifier(
      sp,
      LocalKeys({ keys: [authority.publicKey] }),
      opId.authority,
      "https://localhost",
    );
    const resultSp = await verify();
    expect(resultSp).instanceOf(SiteProfileVerifyFailed);
  });

  test("WSPのURLがnullの時に検証に失敗するか", async () => {
    const wspWithNullCredentialSubjectUrl: WebsiteProfile = {
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
        url: "null",
      },
    };

    const evilSp: SiteProfile = {
      originators: ops,
      credential: await signJwtVc(
        wspWithNullCredentialSubjectUrl,
        holder.privateKey,
        signOptions,
      ),
    };

    const verify = SpVerifier(
      evilSp,
      LocalKeys({ keys: [authority.publicKey] }),
      opId.authority,
      "https://localhost",
    );
    const resultSp = await verify();
    expect(resultSp).instanceOf(SiteProfileVerifyFailed);
  });

  test("オリジンがnullの時に検証に失敗するか", async () => {
    const verify = SpVerifier(
      sp,
      LocalKeys({ keys: [authority.publicKey] }),
      opId.authority,
      "null",
    );
    const resultSp = await verify();
    expect(resultSp).instanceOf(SiteProfileVerifyFailed);
  });

  test("WSPのURLとオリジンが共にnullの時に検証に失敗するか", async () => {
    const wspWithNullCredentialSubjectUrl: WebsiteProfile = {
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
        url: "null",
      },
    };

    const evilSp: SiteProfile = {
      originators: ops,
      credential: await signJwtVc(
        wspWithNullCredentialSubjectUrl,
        holder.privateKey,
        signOptions,
      ),
    };

    const verify = SpVerifier(
      evilSp,
      LocalKeys({ keys: [authority.publicKey] }),
      opId.authority,
      "null",
    );
    const resultSp = await verify();
    expect(resultSp).instanceOf(SiteProfileVerifyFailed);
  });
});
