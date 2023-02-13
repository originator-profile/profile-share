import { test, expect } from "vitest";
import { Window } from "happy-dom";
import { DpVisibleText, DpText, DpHtml } from "@webdino/profile-model";
import { extractBody } from "./extract-body";

const base = {
  url: "https://example.com",
  type: "text",
  location: "body",
  proof: {
    jws: "",
  },
};

const window = new Window();
const document = window.document as unknown as Document;
document.body.innerHTML =
  '<p>Hello, World!</p><p style="display:none">None</p><p>Goodbye, World!</p>';
document.location.href = "https://example.com/";

test("extract body as visibleText type", () => {
  const item: DpVisibleText = {
    ...base,
    type: "visibleText",
  };
  const result = extractBody(document, item);
  expect(result).not.instanceOf(Error);
  expect(result).toBe("Hello, World!\nGoodbye, World!");
});

test("extract body as text type", () => {
  const item: DpText = {
    ...base,
    type: "text",
  };
  const result = extractBody(document, item);
  expect(result).not.instanceOf(Error);
  expect(result).toBe("Hello, World!NoneGoodbye, World!");
});

test("extract body as html type", () => {
  const item: DpHtml = {
    ...base,
    type: "html",
  };
  const result = extractBody(document, item);
  expect(result).not.instanceOf(Error);
  expect(result).toBe(
    '<body><p>Hello, World!</p><p style="display:none">None</p><p>Goodbye, World!</p></body>'
  );
});

test("extract body failure when url misatch", () => {
  const item: DpText = {
    ...base,
    url: "https://evil.com",
    type: "text",
  };
  const result = extractBody(document, item);
  expect(result).instanceOf(Error);
});
