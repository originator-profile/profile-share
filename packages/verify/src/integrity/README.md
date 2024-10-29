# integrity

リソースの整合性の検証

[types.ts](./types.ts)

## verifyIntegrity

Target Integrity の検証

```ts
const content = {
  type: "HtmlTargetIntegrity", // or ***TargetIntegrity
  cssSelector: "<CSS セレクター>",
  integrity: "sha256-...",
};

await verifyIntegrity(content); // true or false
```

## verifyDigestSri

`digestSRI` の検証

```ts
const content: DigestSriContent = {
  id: "<URL>",
  digestSRI: "sha256-...",
};

await verifyDigestSri(content); // true or false
```
