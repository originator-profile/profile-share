import { test, expect } from "vitest";
import { JSDOM } from "jsdom";
import { DpText, DpHtml } from "@webdino/profile-model";
import { extractBody } from "./extract-body";

const base = {
  url: "https://example.com",
  type: "text",
  location: "p",
  proof: {
    jws: "",
  },
};

const dom = new JSDOM(
  `
  <!doctype html>
  <html lang="en">
    <head>
      <title>Test</title>
    </head>
    <body>
      <p>Hello,<br>World!</p>
      <p style="visibility: hidden;">Hidden Text</p>
      <p>Goodbye, World!</p>
    </body>
  </html>
`,
  { url: "https://example.com/" }
);

// TODO: visibleText 型での文字列の抽出をテストして
// NOTE: JSDOM の innerText は未実装 https://github.com/jsdom/jsdom/issues/1245

test("extract body as text type", () => {
  const item: DpText = {
    ...base,
    type: "text",
  };
  const result = extractBody(dom.window.document, item);
  expect(result).not.instanceOf(Error);
  expect(result).toEqual("Hello,World!Hidden TextGoodbye, World!");
});

test("extract body as html type", () => {
  const item: DpHtml = {
    ...base,
    type: "html",
  };
  const result = extractBody(dom.window.document, item);
  expect(result).not.instanceOf(Error);
  expect(result).toEqual(
    `<p>Hello,<br>World!</p><p style="visibility: hidden;">Hidden Text</p><p>Goodbye, World!</p>`
  );
});

test("extract body failure when url misatch", () => {
  const item: DpText = {
    ...base,
    url: "https://evil.com",
    type: "text",
  };
  const result = extractBody(dom.window.document, item);
  expect(result).instanceOf(Error);
});
