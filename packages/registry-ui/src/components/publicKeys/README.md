# publicKeys

公開鍵

[types.ts](./types.ts)

## usePublicKeys()

公開鍵の取得・登録・削除

```ts
const publicKeys = usePublicKeys();

// 公開鍵の登録
publicKeys.register.trigger({ jwk });

// 公開鍵の削除
publicKeys.destroy.trigger({ kid });

// 登録済みの公開鍵
publicKeys.data.keys;
```
