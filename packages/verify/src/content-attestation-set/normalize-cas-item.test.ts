import { ContentAttestationSetItem } from "@originator-profile/model";
import { describe, expect, test } from "vitest";
import { normalizeCasItem } from "./normalize-cas-item";

describe("normalize CAS item as ...", () => {
  test("string type to object type", () => {
    const casItem: ContentAttestationSetItem = "eyJ...";
    const result = normalizeCasItem(casItem);
    expect(result).toStrictEqual({ main: false, attestation: "eyJ..." });
  });
  test("object type keep same", () => {
    const cas: ContentAttestationSetItem = {
      main: true,
      attestation: "eyJ...",
    };
    const result = normalizeCasItem(cas);
    expect(result).toStrictEqual({ main: true, attestation: "eyJ..." });
  });
});
