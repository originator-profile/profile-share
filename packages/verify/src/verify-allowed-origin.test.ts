import { ContentAttestation } from "@originator-profile/model";
import { describe, test, expect } from "vitest";
import { verifyAllowedOrigin } from "./verify-allowed-origin";

describe("verify-allowed-origin", () => {
  test("allowedOriginの配列に対する検証でtrueが返されるか", () => {
    const contentAttestation: ContentAttestation = {
      "@context": [
        "https://www.w3.org/ns/credentials/v2",
        "https://originator-profile.org/ns/credentials/v1",
        "https://originator-profile.org/ns/cip/v1",
        { "@language": "ja" },
      ],
      type: ["VerifiableCredential", "ContentAttestation"],
      issuer: "dns:example.com",
      credentialSubject: {
        id: "urn:uuid:78550fa7-f846-4e0f-ad5c-8d34461cb95b",
        type: "OnlineAd",
        name: "<広告のタイトル>",
        description: "<広告の説明>",
        image: {
          id: "https://ad.example.com/image.png",
          digestSRI: "sha256-5uQVtkoRdTFbimAz3Wz5GQcuBRLt7tDMD5JRtGFo9/M=",
        },
      },
      allowedOrigin: ["https://ad.example.com", "https://ad.example1.com"],
      target: [
        {
          type: "ExternalResourceTargetIntegrity",
          integrity: "sha256-rLDPDYArkNcCvnq0h4IgR7MVfJIOCCrx4z+w+uywc64=",
        },
      ],
    };

    const origin = "https://ad.example.com";
    expect(
      verifyAllowedOrigin(origin, contentAttestation.allowedOrigin as string[]),
    ).toBeTruthy();
  });

  test("allowedOriginの配列に対する検証でfalseが返されるか", () => {
    const contentAttestation: ContentAttestation = {
      "@context": [
        "https://www.w3.org/ns/credentials/v2",
        "https://originator-profile.org/ns/credentials/v1",
        "https://originator-profile.org/ns/cip/v1",
        { "@language": "ja" },
      ],
      type: ["VerifiableCredential", "ContentAttestation"],
      issuer: "dns:example.com",
      credentialSubject: {
        id: "urn:uuid:78550fa7-f846-4e0f-ad5c-8d34461cb95b",
        type: "OnlineAd",
        name: "<広告のタイトル>",
        description: "<広告の説明>",
        image: {
          id: "https://ad.example.com/image.png",
          digestSRI: "sha256-5uQVtkoRdTFbimAz3Wz5GQcuBRLt7tDMD5JRtGFo9/M=",
        },
      },
      allowedOrigin: "https://ad.example.com",
      target: [
        {
          type: "ExternalResourceTargetIntegrity",
          integrity: "sha256-rLDPDYArkNcCvnq0h4IgR7MVfJIOCCrx4z+w+uywc64=",
        },
      ],
    };

    const origin = "https://ad.example.com";

    expect(
      verifyAllowedOrigin(origin, contentAttestation.allowedOrigin as string),
    ).toBeTruthy();
  });

  test("allowedOriginが単一の文字列の検証でtrueが返されるか", () => {
    const contentAttestation: ContentAttestation = {
      "@context": [
        "https://www.w3.org/ns/credentials/v2",
        "https://originator-profile.org/ns/credentials/v1",
        "https://originator-profile.org/ns/cip/v1",
        { "@language": "ja" },
      ],
      type: ["VerifiableCredential", "ContentAttestation"],
      issuer: "dns:example.com",
      credentialSubject: {
        id: "urn:uuid:78550fa7-f846-4e0f-ad5c-8d34461cb95b",
        type: "OnlineAd",
        name: "<広告のタイトル>",
        description: "<広告の説明>",
        image: {
          id: "https://ad.example.com/image.png",
          digestSRI: "sha256-5uQVtkoRdTFbimAz3Wz5GQcuBRLt7tDMD5JRtGFo9/M=",
        },
      },
      allowedOrigin: ["https://ad.example1.com", "https://ad.example2.com"],
      target: [
        {
          type: "ExternalResourceTargetIntegrity",
          integrity: "sha256-rLDPDYArkNcCvnq0h4IgR7MVfJIOCCrx4z+w+uywc64=",
        },
      ],
    };

    const origin = "https://example.com";

    expect(
      verifyAllowedOrigin(origin, contentAttestation.allowedOrigin as string[]),
    ).toBeFalsy();
  });

  test("allowedOriginが単一の文字列の検証でfalseが返されるか", () => {
    const contentAttestation: ContentAttestation = {
      "@context": [
        "https://www.w3.org/ns/credentials/v2",
        "https://originator-profile.org/ns/credentials/v1",
        "https://originator-profile.org/ns/cip/v1",
        { "@language": "ja" },
      ],
      type: ["VerifiableCredential", "ContentAttestation"],
      issuer: "dns:example.com",
      credentialSubject: {
        id: "urn:uuid:78550fa7-f846-4e0f-ad5c-8d34461cb95b",
        type: "OnlineAd",
        name: "<広告のタイトル>",
        description: "<広告の説明>",
        image: {
          id: "https://ad.example.com/image.png",
          digestSRI: "sha256-5uQVtkoRdTFbimAz3Wz5GQcuBRLt7tDMD5JRtGFo9/M=",
        },
      },
      allowedOrigin: "https://ad.example1.com",
      target: [
        {
          type: "ExternalResourceTargetIntegrity",
          integrity: "sha256-rLDPDYArkNcCvnq0h4IgR7MVfJIOCCrx4z+w+uywc64=",
        },
      ],
    };

    const origin = "https://example.com";

    expect(
      verifyAllowedOrigin(origin, contentAttestation.allowedOrigin as string),
    ).toBeFalsy();
  });

  test("空文字で検証をした時にfalseが返されるか", () => {
    expect(verifyAllowedOrigin("", "https://example.com")).toBeFalsy();
  });

  test("一部一致するURLでfalseが返されるか", () => {
    expect(
      verifyAllowedOrigin("https://example.co", "https://example.com"),
    ).toBeFalsy();
  });
});
