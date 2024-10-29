---
sidebar_position: 40
---

# Contexts, Vocabularies, and Types

## Datatypes

### The `sriString` Datatype

[Verifiable Credentials Data Model v2.0 セクション B.3.1](https://www.w3.org/TR/vc-data-model-2.0/#the-sristring-datatype) の定義に準拠し (MUST)、かつハッシュを2つ以上含まない (MUST NOT) ようにしてください。使用可能なハッシュについては[ハッシュアルゴリズム](./algorithm.md#hash-algorithm)に準拠してください (MUST)。

例:

```
sha256-GtNUUolQVlwIkQU9JknWkwkhfdiVmHr/BOnLFFHC5jI=
```

### The `image` Datatype

`image` データ型の値は、 JSON-LD Node Object であり、次のプロパティを含みます。

- `id`: REQUIRED. 画像の URL です。
- `digestSRI`: RECOMMENDED. 画像の完全性を保証するためのハッシュ値です。 [`sriString` データ型](#the-sristring-datatype) でなければなりません (MUST)。

例:

```json
{
  "id": "https://example.com/image.png",
  "digestSRI": "sha256-OYP9B9EPFBi1vs0dUqOhSbHmtP+ZSTsUv2/OjSzWK0w="
}
```

### The `page` Datatype

`page` データ型の値は、 JSON-LD Node Object であり、次のプロパティを含みます。

- `id`: REQUIRED. Web ページの URL です。
- `name`: REQUIRED. Web ページのタイトルです。

## Contexts

_このセクションは非規範的です。_

:::note

これらのコンテキスト定義は最新の仕様を反映していません。各 VC, プロパティの定義については各仕様文書を参照してください。

:::

### https://originator-profile.org/ns/credentials/v1

_このセクションは非規範的です。_

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
    "CoreProfile": "https://originator-profile.org/ns/credentials/v1#CoreProfile",
    "Core": {
      "@id": "https://originator-profile.org/ns/credentials/v1#Core",
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
    "WebMediaSubject": {
      "@id": "https://originator-profile.org/ns/credentials/v1#WebMediaSubject",
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
    "Website": {
      "@id": "https://originator-profile.org/ns/credentials/v1#Website",
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

### https://originator-profile.org/ns/cip/v1

_このセクションは非規範的です。_

```json
{
  "@context": {
    "@version": 1.1,
    "@base": "https://originator-profile.org/ns/cip/v1",
    "@protected": true,
    "cip": "https://originator-profile.org/ns/cip/v1#",
    "op": "https://originator-profile.org/ns/credentials/v1#",
    "CertificateSubject": {
      "@id": "https://originator-profile.org/ns/cip/v1#CertificateSubject",
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
        "verifier": "https://schema.org/name",
        "certifier": "https://schema.org/name"
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
    "ECJP": {
      "@id": "https://originator-profile.org/ns/cip/v1#ECJP",
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
    "WebArticle": {
      "@id": "https://originator-profile.org/ns/cip/v1#WebArticle",
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
    "OnlineAd": {
      "@id": "https://originator-profile.org/ns/cip/v1#OnlineAd",
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
