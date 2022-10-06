import { test, expect } from "vitest";
import { Window } from "happy-dom";
import { DpVisibleText, DpText, DpHtml } from "@webdino/profile-model";
import { extractBody } from "./extract-body";

const base = {
  url: "https://example.com",
  type: "text",
  location: "p",
  proof: {
    jws: "",
  },
};

const window = new Window();
const document = window.document as unknown as Document;
document.body.innerHTML = `
  <p>Hello,<br>World!</p>
  <p style="visibility: hidden;">Hidden Text</p>
  <p>Goodbye, World!</p>
`;
document.location.href = "https://example.com/";

test("extract body as text type", () => {
  const item: DpVisibleText = {
    ...base,
    type: "visibleText",
  };
  const result = extractBody(document, item);
  expect(result).not.instanceOf(Error);
  expect(result).toEqual("Hello,World!Hidden TextGoodbye, World!");
});

test("extract body as text type", () => {
  const item: DpText = {
    ...base,
    type: "text",
  };
  const result = extractBody(document, item);
  expect(result).not.instanceOf(Error);
  expect(result).toEqual("Hello,World!Hidden TextGoodbye, World!");
});

test("extract body as html type", () => {
  const item: DpHtml = {
    ...base,
    type: "html",
  };
  const result = extractBody(document, item);
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
  const result = extractBody(document, item);
  expect(result).instanceOf(Error);
});
