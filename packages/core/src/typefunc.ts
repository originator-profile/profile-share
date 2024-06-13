// undefined 型を取らないキーの union
type NonUndefinedKeys<T> = {
  [K in keyof T]: undefined extends T[K] ? never : K;
}[keyof T];

/**
 * 任意プロパティを nullまたはundefinedを許容する型に変換します
 *
 * @template T 変換対象のオブジェクトの型
 * @returns 新しい型
 */
export type NullableKeysType<T> = {
  [K in keyof T]: K extends NonUndefinedKeys<T>
    ? T[K]
    : T[K] | null | undefined;
};

/**
 * 指定されたプロパティを任意プロパティ型にします
 *
 * @template T 元の型
 * @template K オプションにするプロパティのキー
 * @returns 指定されたプロパティを任意プロパティ型にした新しい型
 */
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [prop in K]?: T[prop];
};
