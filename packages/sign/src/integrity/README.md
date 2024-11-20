# integrity

リソースの整合性

[types.ts](./types.ts)

## createIntegrity

Target Integrity の作成

```ts
const content = {
  type: "HtmlTargetIntegrity", // or ***TargetIntegrity
  cssSelector: "<CSS セレクター>",
};

const { integrity } = await createIntegrity("sha256", content);
console.log(integrity); // sha256-...
```

## createDigestSri

`digestSRI` の作成

```ts
const resource = {
  id: "<URL>",
};

const { digestSRI } = await createDigestSri("sha256", resource);
console.log(digestSRI); // sha256-...
```
