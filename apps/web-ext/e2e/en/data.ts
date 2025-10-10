import type {
  Certificate,
  CoreProfile,
  Jwk,
  UnsignedContentAttestation,
  WebMediaProfile,
  WebsiteProfile,
} from "@originator-profile/model";

export function generateCoreProfileData(
  publicKey: Jwk,
  issuer: string = "dns:localhost",
): CoreProfile {
  return {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://originator-profile.org/ns/credentials/v1",
    ],
    type: ["VerifiableCredential", "CoreProfile"],
    issuer: issuer,
    credentialSubject: {
      id: issuer,
      type: "Core",
      jwks: {
        keys: [publicKey],
      },
    },
  };
}

export function generateCertificateData(
  issuer: string = "dns:localhost",
): Certificate {
  return {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://originator-profile.org/ns/credentials/v1",
      "https://originator-profile.org/ns/cip/v1",
      {
        "@language": "en",
      },
    ],
    type: ["VerifiableCredential", "Certificate"],
    issuer: issuer,
    credentialSubject: {
      id: issuer,
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
}

export function generateWebMediaProfileData(
  issuer: string = "dns:localhost",
): WebMediaProfile {
  return {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://originator-profile.org/ns/credentials/v1",
      "https://originator-profile.org/ns/cip/v1",
      {
        "@language": "en",
      },
    ],
    type: ["VerifiableCredential", "WebMediaProfile"],
    issuer: issuer,
    credentialSubject: {
      id: issuer,
      type: "OnlineBusiness",
      name: "Originator Profile Technology Research Association (Development)",
      url: "http://localhost:8080",
    },
  };
}

export function generateWebsiteProfileData(
  issuer: string = "dns:op-holder.example.com",
): WebsiteProfile {
  return {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://originator-profile.org/ns/credentials/v1",
      "https://originator-profile.org/ns/cip/v1",
      {
        "@language": "en",
      },
    ],
    type: ["VerifiableCredential", "WebsiteProfile"],
    issuer: issuer,
    credentialSubject: {
      id: "http://localhost:8080",
      type: "WebSite",
      name: "Site Profile Verification",
      description: "<Website description>",
      image: {
        id: "https://media.example.com/image.png",
      },
      allowedOrigin: ["http://localhost:8080"],
    },
  };
}

export function generateUnsignedContentAttestation(
  content: string,
  issuer: string = "dns:op-holder.example.com",
  attestationType: "Article" | "OnlineAd" = "Article",
): UnsignedContentAttestation {
  const baseAttestation = {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://originator-profile.org/ns/credentials/v1",
      "https://originator-profile.org/ns/cip/v1",
      {
        "@language": "en",
      },
    ],
    type: ["VerifiableCredential", "ContentAttestation"],
    issuer: issuer,
    allowedUrl: "http://localhost:8080/*",
    target: [
      {
        type: "TextTargetIntegrity" as const,
        content,
        cssSelector: "#text-target-integrity",
      },
    ],
  };

  if (attestationType === "Article") {
    return {
      ...baseAttestation,
      credentialSubject: {
        type: "Article",
        headline: "<Web page title>",
        image: {
          id: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==",
        },
        description: "<Web page description>",
        author: ["Hanako Yamada"],
        editor: ["Taro Yamada"],
        datePublished: "2023-07-04T19:14:00Z",
        dateModified: "2023-07-04T19:14:00Z",
        genre: "Arts & Entertainment",
        id: "urn:uuid:5c464165-c579-4fc9-aaff-ca4a65e79947",
      },
    };
  }

  return {
    ...baseAttestation,
    credentialSubject: {
      type: "OnlineAd",
      name: "Test Ad Title",
      image: {
        id: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==",
      },
      description: "Test ad description",
      genre: "Arts & Entertainment",
      landingPageUrl: "https://ad.landingpage.example.com",
      id: "urn:uuid:5c464165-c579-4fc9-aaff-ca4a65e79947",
    },
  };
}
