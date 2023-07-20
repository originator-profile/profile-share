import { expect, test } from "vitest";
import {
  expirationDateTimeLocaleFrom,
  parseExpirationDate,
} from "./expiration-date";

test("ISO 8601 形式の日付", () => {
  expect(parseExpirationDate("2023-07-31").toISOString()).toBe(
    "2023-07-31T15:00:00.000Z",
  );
});

test("ISO 8601 形式の日付・時刻1", () => {
  expect(parseExpirationDate("2023-07-31T24:00:00.000Z").toISOString()).toBe(
    "2023-08-01T00:00:00.000Z",
  );
});

test("ISO 8601 形式の日付・時刻2", () => {
  expect(
    parseExpirationDate("2023-07-31T24:00:00.000+09:00").toISOString(),
  ).toBe("2023-07-31T15:00:00.000Z");
});

test("ロケールの表記規則に従って有効期限日付時刻文字列表現に変換1", () => {
  expect(
    expirationDateTimeLocaleFrom(new Date("2023-07-31T24:00:00.000+09:00")),
  ).toBe("2023/7/31 23:59:59");
});

test("ロケールの表記規則に従って有効期限日付時刻文字列表現に変換2", () => {
  expect(expirationDateTimeLocaleFrom("2023-07-31T24:00:00.000+09:00")).toBe(
    "2023/7/31 23:59:59",
  );
});
