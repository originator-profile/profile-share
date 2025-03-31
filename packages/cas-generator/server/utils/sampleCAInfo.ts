export default {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    {
      "@language": "ja",
    },
  ],
  type: ["VerifiableCredential", "ContentAttestation"],
  issuer: "dns:oprexpt.originator-profile.org",
  credentialSubject: {
    type: "Article",
    headline: "デジタル空間に、もっと信頼を。 Originator Profile",
    description:
      "OPは、コンテンツ発信者を識別可能にすることで、第三者認証済みのメディアとコンテンツを読者が容易に見分けられる仕組みを確立します",
    image: {
      id: "https://originator-profile.org/ogp-ja.png",
    },
    datePublished: "2024-12-03T15:17:00Z",
    dateModified: "2024-12-03T15:17:00Z",
    author: ["Originator Profile 技術研究組合"],
    editor: ["Originator Profile 技術研究組合"],
    genre: "technology",
  },
  allowedUrl: ["https://originator-profile.org/ja-JP/"],
  target: [
    {
      type: "TextTargetIntegrity",
      content: "https://originator-profile.org/ja-JP/",
      cssSelector: "main",
    },
  ],
};
