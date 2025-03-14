# Debugger

Profile Set などの検証処理を実行し、結果を閲覧するための I/O UI

[types.ts](./types.ts)

```ts
export type PresentationTypeValue = "url" | "direct";

export type DebugTargetValue = "デバッグターゲット";
```

## DebugTargetSelectField

デバッグする対象を選択するための選択項目

```tsx
const debugTarget: DebugTargetValue = "デバッグターゲット";

<DebugTargetSelectField
  value={debugTarget}
  name="debugTarget"
  onChange={(event) => console.log(event.target.value)}
/>;
```

## DirectInputField

デバッグする対象を直接入力するための入力項目

```tsx
<DirectInputField
  hidden
  id="directInput"
  name="directINput"
  defaultValue="eyJ...~"
/>
```

## EndpointInputField

デバッグする対象を取得するエンドポイントの入力項目

```tsx
<EndpointInputField
  hidden
  id="endpoint"
  name="endpoint"
  defaultValue="https://example.com/path/to/op.jwt"
/>
```

## PresentationTypeInputField

提示方法を入力するための入力項目

```tsx
const presentationType: PresentationTypeValue = "url";

<PresentationTypeInputField
  value={presentationType}
  name="presentationType"
  onChange={(event) => console.log(event.target.value)}
/>;
```

## RegistryInputField

使用するレジストリドメイン名を入力するための入力項目

```tsx
<RegistryInputField
  id="registry"
  name="registry"
  defaultValue="oprexpt.originator-profile.org"
/>
```

## ResultText

デバッグ結果を提示するための見た目

```tsx
<ResultText>Result</ResultText>
```
