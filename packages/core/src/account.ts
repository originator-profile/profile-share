import { validate, v5 as uuid5 } from "uuid";

/**
 * ドメイン名を UUID（会員 ID）に変換する
 * @param domainName ドメイン名 (RFC 4501)
 * @return UUID 文字列表現
 */
export function domainName2Uuid(domainName: string): string {
  return uuid5(domainName, uuid5.DNS);
}

/**
 * 会員 ID またはドメイン名の解析
 * @param uuidOrDns UUID 文字列表現 (RFC 4122) またはドメイン名 (RFC 4501)
 * @return UUID 文字列表現
 */
export function parseAccountId(uuidOrDns: string): string {
  uuidOrDns = uuidOrDns.toLowerCase();

  if (uuidOrDns.startsWith("urn:uuid:") || validate(uuidOrDns)) {
    const uuid = uuidOrDns.replace(/^urn:uuid:/, "");
    return uuid;
  }

  const dns = uuidOrDns.replace(/^dns:/, "");
  return domainName2Uuid(dns);
}
