import { getJsonLdNodeObjects } from "@originator-profile/verify";
import { expect, test } from "vitest";
import { Window } from "happy-dom";

test("getJsonLdNodeObjects()はchrome.scripting ScriptInjectionで使用しているのでシリアル化して呼び出せなければならない", () => {
  const func = new Function(getJsonLdNodeObjects.toString());
  const window = new Window();
  expect(() => func(window.document)).not.toThrowError();
});
