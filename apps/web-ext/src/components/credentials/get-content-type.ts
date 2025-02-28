import { SupportedVerifiedCa } from "./types";

export const getContentType = (ca: SupportedVerifiedCa): string => {
  if (ca.main) return "ContentType_MainContent";
  if (ca.attestation.doc.credentialSubject.type === "Article")
    return "ContentType_Article";
  if (ca.attestation.doc.credentialSubject.type === "OnlineAd")
    return "ContentType_Advertisement";
  return "ContentType_Unknown";
};
