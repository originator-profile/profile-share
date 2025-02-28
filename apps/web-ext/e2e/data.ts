import {
  Certificate,
  CoreProfile,
  Jwk,
  UnsignedContentAttestation,
  WebMediaProfile,
  WebsiteProfile,
} from "@originator-profile/model";

export function generateCoreProfileData(publicKey: Jwk): CoreProfile {
  return {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://originator-profile.org/ns/credentials/v1",
    ],
    type: ["VerifiableCredential", "CoreProfile"],
    issuer: "dns:localhost",
    credentialSubject: {
      id: "dns:localhost",
      type: "Core",
      jwks: {
        keys: [publicKey],
      },
    },
  };
}

export function generateCertificateData(): Certificate {
  return {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://originator-profile.org/ns/credentials/v1",
      "https://originator-profile.org/ns/cip/v1",
      {
        "@language": "ja",
      },
    ],
    type: ["VerifiableCredential", "Certificate"],
    issuer: "dns:localhost",
    credentialSubject: {
      id: "dns:localhost",
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

export function generateWebMediaProfileData(): WebMediaProfile {
  return {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://originator-profile.org/ns/credentials/v1",
      "https://originator-profile.org/ns/cip/v1",
      {
        "@language": "ja",
      },
    ],
    type: ["VerifiableCredential", "WebMediaProfile"],
    issuer: "dns:localhost",
    credentialSubject: {
      id: "dns:localhost",
      type: "OnlineBusiness",
      name: "Originator Profile 技術研究組合 (開発用)",
      url: "http://localhost:8080",
    },
  };
}

export function generateWebsiteProfileData(): WebsiteProfile {
  return {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://originator-profile.org/ns/credentials/v1",
      "https://originator-profile.org/ns/cip/v1",
      {
        "@language": "ja",
      },
    ],
    type: ["VerifiableCredential", "WebsiteProfile"],
    issuer: "dns:localhost",
    credentialSubject: {
      id: "http://localhost:8080",
      url: "http://localhost:8080",
      type: "WebSite",
      name: "SiteProfileの取得検証",
      description: "<Webサイトの説明>",
      image: {
        id: "https://media.example.com/image.png",
      },
    },
  };
}

export function generateUnsignedContentAttestation(
  content: string,
): UnsignedContentAttestation {
  return {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://originator-profile.org/ns/credentials/v1",
      "https://originator-profile.org/ns/cip/v1",
      {
        "@language": "ja",
      },
    ],
    type: ["VerifiableCredential", "ContentAttestation"],
    issuer: "dns:localhost",
    credentialSubject: {
      type: "Article",
      headline: "<Webページのタイトル>",
      image: {
        id: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==",
      },
      description: "<Webページの説明>",
      author: ["山田花子"],
      editor: ["山田太郎"],
      datePublished: "2023-07-04T19:14:00Z",
      dateModified: "2023-07-04T19:14:00Z",
      genre: "Arts & Entertainment",
      id: "urn:uuid:5c464165-c579-4fc9-aaff-ca4a65e79947",
    },
    allowedUrl: "http://localhost:8080/*",
    target: [
      {
        type: "TextTargetIntegrity",
        content,
        cssSelector: "#text-target-integrity",
      },
    ],
  };
}
