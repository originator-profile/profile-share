import { CasItem } from "./types";

/**
 * Content Attestation Set 要素の正規化
 *
 * @example
 * ```ts
 * const cas = ["eyJ...", { main: true, attestation: "eyJ..." }];
 * const normalized = normalizeCasItem(cas);
 * normalized; // [{ main: false, attestation: "eyJ..." }, { main: true, attestation: "eyJ..." }]
 * ```
 * */
export function normalizeCasItem<Ca>(ca: Ca | CasItem<Ca>): CasItem<Ca> {
  if (typeof ca === "object" && ca !== null && "attestation" in ca) {
    return ca;
  }
  return { main: false, attestation: ca };
}
