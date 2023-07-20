import { expect, test } from "vitest";
import { parseExpirationDate } from "./expiration-date";

test("ISO 8601 形式の日付", () => {
  expect(parseExpirationDate("2023-07-31").getTime()).toEqual(
    new Date("2023-07-31T15:00:00.000Z").getTime(),
  );
});

test("ISO 8601 形式の日付・時刻1", () => {
  expect(parseExpirationDate("2023-07-31T24:00:00.000Z").getTime()).toEqual(
    new Date("2023-07-31T24:00:00.000Z").getTime(),
  );
});

test("ISO 8601 形式の日付・時刻2", () => {
  expect(
    parseExpirationDate("2023-07-31T24:00:00.000+09:00").getTime(),
  ).toEqual(new Date("2023-07-31T15:00:00.000Z").getTime());
});
