---
sidebar_position: 40
---

# JSON-LD Context Definitions Note

_この文書は非規範的です。_

## https://originator-profile.org/ns/credentials/v1

```json
{
  "@context": {
    "@version": 1.1,
    "@base": "https://originator-profile.org/ns/credentials/v1",
    "@protected": true,
    "op": "https://originator-profile.org/ns/credentials/v1#",
    "Image": {
      "@id": "https://originator-profile.org/ns/credentials/v1#image",
      "@context": {
        "@protected": true,
        "id": {
          "@id": "https://schema.org/image",
          "@type": "@id"
        },
        "digestSRI": {
          "@id": "https://www.w3.org/2018/credentials#digestSRI",
          "@type": "https://www.w3.org/2018/credentials#sriString"
        }
      }
    },
    "allowedOrigin": "https://schema.org/url",
    "allowedUrl": "https://schema.org/url",
    "PlainTextDescription": {
      "@id": "https://originator-profile.org/ns/credentials/v1#PlainTextDescription",
      "@context": {
        "@protected": true,
        "type": "@type",
        "data": {
          "@id": "https://originator-profile.org/ns/credentials/v1#data",
          "@type": "https://schema.org/Text"
        }
      }
    },
    "ContentAttestation": {
      "@id": "https://originator-profile.org/ns/credentials/v1#ContentAttestation",
      "@context": {
        "@protected": true,
        "allowedOrigin": "op:allowedOrigin",
        "allowedUrl": "op:allowedUrl",
        "target": {
          "@id": "https://originator-profile.org/ns/credentials/v1#target",
          "@type": "@id"
        }
      }
    },
    "CoreProfile": {
      "@id": "https://originator-profile.org/ns/credentials/v1#CoreProfile",
      "@context": {
        "@protected": true,
        "id": "@id",
        "jwks": {
          "@id": "https://originator-profile.org/ns/credentials/v1#jwks",
          "@type": "@json"
        }
      }
    },
    "ProfileAnnotation": "https://originator-profile.org/ns/credentials/v1#ProfileAnnotation",
    "WebMediaProfile": "https://originator-profile.org/ns/credentials/v1#WebMediaProfile",
    "WebMediaProperties": {
      "@id": "https://originator-profile.org/ns/credentials/v1#WebMediaProperties",
      "@context": {
        "@protected": true,
        "id": "@id",
        "type": "@type",
        "url": "https://schema.org/url",
        "name": "https://schema.org/name",
        "logo": "op:Image",
        "email": "https://schema.org/email",
        "telephone": "https://schema.org/telephone",
        "title": "https://schema.org/title",
        "image": "op:Image",
        "description": "https://schema.org/description",
        "origin": {
          "@id": "https://originator-profile.org/ns/credentials/v1#origin",
          "@type": "https://schema.org/url"
        },
        "contactTitle": "https://schema.org/title",
        "contactUrl": "https://schema.org/url",
        "privacyPolicyTitle": "https://schema.org/title",
        "privacyPolicyUrl": "https://schema.org/url",
        "publishingPrincipleTitle": "https://schema.org/title",
        "publishingPrincipleUrl": "https://schema.org/url"
      }
    },
    "WebsiteProfile": "https://originator-profile.org/ns/credentials/v1#WebsiteProfile",
    "WebsiteProperties": {
      "@id": "https://originator-profile.org/ns/credentials/v1#WebsiteProperties",
      "@context": {
        "@protected": true,
        "id": "@id",
        "type": "@type",
        "title": "https://schema.org/title",
        "image": "op:Image",
        "description": "https://schema.org/description",
        "origin": {
          "@id": "https://originator-profile.org/ns/credentials/v1#origin",
          "@type": "https://schema.org/url"
        }
      }
    }
  }
}
```

## https://originator-profile.org/ns/cip/v1

```json
{
  "@context": {
    "@version": 1.1,
    "@base": "https://originator-profile.org/ns/cip/v1",
    "@protected": true,
    "cip": "https://originator-profile.org/ns/cip/v1#",
    "op": "https://originator-profile.org/ns/credentials/v1#",
    "CertificateProperties": {
      "@id": "https://originator-profile.org/ns/cip/v1#CertificateProperties",
      "@context": {
        "@protected": true,
        "id": "@id",
        "type": "@type",
        "description": "https://schema.org/description",
        "image": "op:image",
        "certificationSystem": {
          "@id": "https://originator-profile.org/ns/cip/v1#certificationSystem",
          "@type": "@id"
        },
        "verifier": {
          "@id": "https://originator-profile.org/ns/cip/v1#verifier",
          "@type": "@id"
        },
        "certifier": {
          "@id": "https://originator-profile.org/ns/cip/v1#certifier",
          "@type": "@id"
        }
      }
    },
    "CertificationSystem": {
      "@id": "https://originator-profile.org/ns/cip/v1#CertificationSystem",
      "@context": {
        "@protected": true,
        "id": "@id",
        "type": "@type",
        "name": "https://schema.org/name",
        "description": "https://schema.org/description",
        "ref": {
          "@id": "https://originator-profile.org/ns/cip/v1#ref",
          "@type": "@id"
        }
      }
    },
    "ECJPProperties": {
      "@id": "https://originator-profile.org/ns/cip/v1#OrganizationProperties",
      "@context": {
        "@protected": true,
        "id": "@id",
        "type": "@type",
        "addressCountry": "https://schema.org/addressCountry",
        "name": "https://schema.org/name",
        "corporateNumber": "https://schema.org/identifier",
        "postalCode": "https://schema.org/postalCode",
        "addressRegion": "https://schema.org/addressRegion",
        "addressLocality": "https://schema.org/addressLocality",
        "streetAddress": "https://schema.org/streetAddress",
        "certificationSystem": {
          "@id": "https://originator-profile.org/ns/cip/v1#certificationSystem",
          "@type": "@id"
        }
      }
    },
    "Certificate": {
      "@id": "https://originator-profile.org/ns/cip/v1#Certificate",
      "@context": {
        "@protected": true,
        "certificationSystem": {
          "@id": "https://originator-profile.org/ns/cip/v1#certificationSystem",
          "@type": "@id"
        }
      }
    },
    "ExistenceCertificateInJapan": "https://originator-profile.org/ns/cip/v1#ExistenceCertificateInJapan",
    "ContentProperties": {
      "@id": "https://originator-profile.org/ns/cip/v1#ContentProperties",
      "@context": {
        "@protected": true,
        "title": "https://schema.org/title",
        "image": "op:image",
        "source": "https://schema.org/url",
        "description": "https://schema.org/description",
        "author": "https://schema.org/author",
        "editor": "https://schema.org/editor",
        "datePublished": "https://schema.org/datePublished",
        "dateModified": "https://schema.org/dateModified",
        "category": "cip:category"
      }
    },
    "AdvertisementProperties": {
      "@id": "https://originator-profile.org/ns/cip/v1#AdvertisementProperties",
      "@context": {
        "@protected": true,
        "id": "@id",
        "type": "@type",
        "title": "https://schema.org/title",
        "image": "op:image",
        "description": "https://schema.org/description"
      }
    },
    "Integrity": {
      "@id": "https://originator-profile.org/ns/cip/v1#integrity",
      "@type": "https://www.w3.org/2018/credentials#sriString"
    },
    "HtmlTargetIntegrity": {
      "@id": "op:HtmlTargetIntegrity",
      "@context": {
        "@protected": true,
        "type": "@type",
        "integrity": "cip:Integrity",
        "cssSelector": "https://schema.org/cssSelector"
      }
    },
    "VisibleTextTargetIntegrity": {
      "@id": "op:VisibleTextTargetIntegrity",
      "@context": {
        "@protected": true,
        "type": "@type",
        "integrity": "cip:Integrity",
        "cssSelector": "https://schema.org/cssSelector"
      }
    },
    "TextTargetIntegrity": {
      "@id": "op:TextTargetIntegrity",
      "@context": {
        "@protected": true,
        "type": "@type",
        "integrity": "cip:Integrity",
        "cssSelector": "https://schema.org/cssSelector"
      }
    },
    "ExternalResourceTargetIntegrity": {
      "@id": "op:ExternalResourceTargetIntegrity",
      "@context": {
        "@protected": true,
        "type": "@type",
        "integrity": "cip:Integrity"
      }
    }
  }
}
```
