/**
 * Error クラスインスタンスを含むデータの文字列化
 * @param data Error クラスインスタンスかもしれないデータ
 * @param indent 整形時のインデント長
 * @returns JSON 文字列
 **/
export function stringifyWithError(data: unknown, indent?: number): string {
  return data instanceof Error
    ? JSON.stringify(data, Object.getOwnPropertyNames(data), indent)
    : JSON.stringify(data, null, indent);
}
