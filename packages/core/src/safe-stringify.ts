/**
 * Error クラスインスタンスを含むデータの文字列化
 * @param data Error クラスインスタンスかもしれないデータ
 * @returns JSON 文字列
 **/
export function stringifyWithError(data: unknown): string {
  return data instanceof Error
    ? JSON.stringify(data, Object.getOwnPropertyNames(data))
    : JSON.stringify(data);
}
