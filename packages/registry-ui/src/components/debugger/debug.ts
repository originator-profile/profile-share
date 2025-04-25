import { stringifyWithError } from "@originator-profile/core";
import { Keys } from "@originator-profile/cryptography";
import {
  ContentAttestationSet,
  Jwks,
  OriginatorProfileSet,
  SiteProfile,
} from "@originator-profile/model";
import {
  DecodedOps,
  OpsVerifier,
  SpVerifier,
  VerifiedCas,
  VerifiedOps,
  VerifiedSp,
  decodeOps,
  verifyCas,
  verifyIntegrity,
} from "@originator-profile/verify";
import { DebugResult, Output, PresentationType } from "./types";
import { htmlPolicy } from "./trusted-types";

/** URL としてパースできないケースや URL path が "" や "/" のケースでの変換処理 */
export function transformEndpoint(endpoint: string): string {
  // NOTE: URL パースできないケース … 特別に "https://" + endpoint と解釈 (#1240)
  if (!URL.canParse(endpoint)) {
    endpoint = `https://${endpoint}`;
  }

  // NOTE: URL path が "" や "/" のケース … 特別に "/.well-known/sp.json" と解釈 (#1240)
  if (new URL(endpoint).origin === endpoint.replace(/[/]$/, "")) {
    endpoint = new URL("/.well-known/sp.json", endpoint).href;
  }

  return endpoint;
}

/** 提示されたデータの取得 */
export async function fetchPresentation<T>(
  type: PresentationType,
  source: string,
): Promise<T | Error> {
  if (type === "embedded") {
    try {
      return JSON.parse(source) as T;
    } catch (e) {
      return e as SyntaxError;
    }
  }
  return fetch(transformEndpoint(source))
    .then((res) => (res.ok ? (res.json() as T) : new Error(res.statusText)))
    .catch((e) => e);
}

/** 失敗オブジェクトのファクトリー関数 */
function fail(output: Output) {
  return {
    ok: false as const,
    output: {
      title: output.title,
      type: output.type,
      src:
        output.type === "json"
          ? JSON.parse(stringifyWithError(output.src))
          : output.src,
    },
  };
}

/** 信頼済み OPS のデバッグ */
export async function debugTrustedOps(
  /** 信頼済み OPS (JSON 文字列) */
  input: string = "",
  /** 信頼済み OP ID */
  trustedOpId: string,
): Promise<
  DebugResult<{
    trustedOps: OriginatorProfileSet;
    decodedTrustedOps: DecodedOps;
    trustedKeys: Jwks;
  }>
> {
  const trustedOps = await fetchPresentation<OriginatorProfileSet>(
    "embedded",
    input,
  );
  if (trustedOps instanceof Error)
    return fail({
      title: "Trusted OPS Invalid",
      type: "json",
      src: trustedOps,
    });
  const decodedTrustedOps = decodeOps(trustedOps);
  if (decodedTrustedOps instanceof Error)
    return fail({
      title: "Trusted OPS Decode Failed",
      type: "json",
      src: decodedTrustedOps,
    });
  const trustedKeys = {
    keys: decodedTrustedOps
      .filter((op) => op.core.doc.credentialSubject.id === trustedOpId)
      .flatMap((op) => op.core.doc.credentialSubject.jwks.keys),
  };
  return { ok: true, result: { trustedOps, decodedTrustedOps, trustedKeys } };
}

/** Site Profile のデバッグ */
export async function debugSiteProfile(
  /** Site Profile */
  input: string = "{}",
  /** 提示形式 (JSON 文字列 or 外部参照 URL) */
  presentationType: PresentationType,
  /** 信頼済み OPS */
  trustedOps: OriginatorProfileSet,
  /** 信頼済み検証鍵 */
  trustedKeys: Keys,
  /** 信頼済み OP ID */
  trustedOpId: string,
  /** URL */
  url: string,
): Promise<DebugResult<VerifiedSp>> {
  const sp = await fetchPresentation<SiteProfile>(presentationType, input);
  if (sp instanceof Error)
    return fail({ title: "Site Profile Invalid", type: "json", src: sp });
  if (!URL.canParse(url))
    return fail({ title: "URL Invalid", type: "text", src: url });
  const websiteOrigin = new URL(transformEndpoint(url)).origin;
  const spVerifier = SpVerifier(
    { ...sp, originators: [...trustedOps, ...sp.originators] },
    trustedKeys,
    trustedOpId,
    websiteOrigin,
  );
  const verifiedSp = await spVerifier();
  if (verifiedSp instanceof Error)
    return fail({
      title: "Site Profile Verification Failed",
      type: "json",
      src: verifiedSp,
    });
  return { ok: true, result: verifiedSp };
}

/** OPS のデバッグ */
export async function debugOps(
  /** OPS */
  input: string = "[]",
  /** 提示形式 (JSON 文字列 or 外部参照 URL) */
  presentationType: PresentationType,
  /** 信頼済み OPS */
  trustedOps: OriginatorProfileSet,
  /** 信頼済み検証鍵 */
  trustedKeys: Keys,
  /** 信頼済み OP ID */
  trustedOpId: string,
): Promise<DebugResult<VerifiedOps>> {
  const ops = await fetchPresentation<OriginatorProfileSet>(
    presentationType,
    input,
  );
  if (ops instanceof Error)
    return fail({ title: "OPS Invalid", type: "json", src: ops });
  const opsVerifier = OpsVerifier(
    [...trustedOps, ...ops],
    trustedKeys,
    trustedOpId,
  );
  const verifiedOps = await opsVerifier();
  if (verifiedOps instanceof Error)
    return fail({
      title: "OPS Verification Failed",
      type: "json",
      src: verifiedOps,
    });
  return { ok: true, result: verifiedOps };
}

/** CAS のデバッグ */
export async function debugCas(
  /** CAS */
  input: string = "[]",
  /** 提示形式 (JSON 文字列 or 外部参照 URL) */
  presentationType: PresentationType,
  /** 検証済み OPS */
  ops: VerifiedOps,
  /** URL */
  url: string,
): Promise<DebugResult<VerifiedCas>> {
  const cas = await fetchPresentation<ContentAttestationSet>(
    presentationType,
    input,
  );
  if (cas instanceof Error)
    return fail({ title: "CAS Invalid", type: "json", src: cas });
  if (!URL.canParse(url))
    return fail({ title: "URL Invalid", type: "text", src: url });
  const contentUrl = transformEndpoint(url);
  const html = await fetch(contentUrl).then((res) => res.text());
  const trustedHtml = htmlPolicy?.createHTML(html);
  const parser = new DOMParser();
  // @ts-expect-error Type 'string | TrustedHTML' is not assignable to type 'string'.
  const doc = parser.parseFromString(trustedHtml ?? html, "text/html");
  const verifiedCas = await verifyCas(
    cas,
    ops,
    transformEndpoint(url),
    (content) => verifyIntegrity(content, doc),
  );
  if (verifiedCas instanceof Error)
    return fail({
      title: "CAS Verification Failed",
      type: "json",
      src: verifiedCas,
    });
  return { ok: true, result: verifiedCas };
}
