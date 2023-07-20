import { Temporal } from "@js-temporal/polyfill";

/**
 * 有効期限の文字列表現のパース
 * @param input 入力
 * @example ISO 8601 形式の日付の場合、その日を有効期限とみなします
 * parseExpirationDate("2023-07-31") // 2023-08-01T00:00:00.000+09:00 (実行環境のタイムゾーンに従います)
 * @example 時刻が含まれる場合、期限切れとなる日時とみなします
 * parseExpirationDate("2023-07-31T24:00:00.000+09:00") // 2023-08-01T00:00:00.000+09:00
 * @return 期限切れ日時
 */
export function parseExpirationDate(input: string): Date {
  try {
    return new Date(Temporal.Instant.from(input).epochMilliseconds);
  } catch {
    // nop
  }

  try {
    return new Date(
      Temporal.PlainDate.from(input)
        .add({ days: 1 })
        .toZonedDateTime(Temporal.Now.timeZoneId()).epochMilliseconds,
    );
  } catch {
    // nop
  }

  return new Date(input);
}
