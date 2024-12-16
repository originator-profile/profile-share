import { getJsonLdNodeObjects } from "@originator-profile/verify";
import { expect, test } from "vitest";
import { Window } from "happy-dom";

test("getJsonLdNodeObjects()はchrome.scripting ScriptInjectionで使用しているのでシリアル化して呼び出せなければならない", () => {
  /* eslint-disable-next-line @typescript-eslint/no-implied-eval */
  const func = new Function(
    "document",
    `${getJsonLdNodeObjects.toString()}\ngetJsonLdNodeObjects(document);`,
  );
  const window = new Window();
  expect(() => func(window.document)).not.toThrowError();
});
