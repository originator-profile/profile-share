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

## fetchAndSetTargetIntegrity

未署名 Content Attestation への Target Integrity の割り当て

```ts
const uca = {
  // ...
  target: [
    {
      type: "<Target Integrityの種別>",
      cssSelector: "<CSS セレクター>",
    },
  ],
};

await fetchAndSetTargetIntegrity("sha256", uca);

console.log(uca.target);
// [
//   {
//     type: "<Target Integrityの種別>",
//     cssSelector: "<CSS セレクター>",
//     integrity: "sha256-..."
//   }
// ]
```

### IntegrityCalculationError

Integrityの計算に失敗 (例: 検証対象が存在しない) エラー

## fetchAndSetDigestSri

オブジェクトへの `digestSRI` の割り当て

```ts
const resource = {
  id: "<URL>",
};

await fetchAndSetDigestSri("sha256", resource);

console.log(resource);
// {
//   id: "<URL>",
//   digestSRI: "sha256-..."
// }
```
