import { test, expect } from "vitest";
import { Window } from "happy-dom";
import { DpVisibleText, DpText, DpHtml } from "@webdino/profile-model";
import { extractBody } from "./extract-body";
import { chromium } from "playwright";

const base = {
  url: "https://example.com",
  type: "text",
  location: "body",
  proof: {
    jws: "",
  },
};

const html =
  '<p>Hello, World!</p><p style="display:none">None</p><p>Goodbye, World!</p>';
const window = new Window();
const document = window.document as unknown as Document;
document.body.innerHTML = html;
document.location.href = "https://example.com/";
const pageUrl = document.location.href;
const locator = async (location: string) =>
  Array.from(document.querySelectorAll<HTMLElement>(location));

test("extract body as visibleText type", async () => {
  const item: DpVisibleText = {
    ...base,
    type: "visibleText",
  };
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.locator("body").evaluate((el, html) => {
    el.innerHTML = html;
  }, html);
  const result = await extractBody(
    item.url,
    (location) => page.locator(location).all(),
    item
  );
  expect(result).not.instanceOf(Error);
  expect(result).toBe("Hello, World!\n\nGoodbye, World!");
});

test("extract body as text type", async () => {
  const item: DpText = {
    ...base,
    type: "text",
  };
  const result = await extractBody(pageUrl, locator, item);
  expect(result).not.instanceOf(Error);
  expect(result).toBe("Hello, World!NoneGoodbye, World!");
});

test("extract body as html type", async () => {
  const item: DpHtml = {
    ...base,
    type: "html",
  };
  const result = await extractBody(pageUrl, locator, item);
  expect(result).not.instanceOf(Error);
  expect(result).toBe(
    '<body><p>Hello, World!</p><p style="display:none">None</p><p>Goodbye, World!</p></body>'
  );
});

test("extract body failure when url misatch", async () => {
  const item: DpText = {
    ...base,
    url: "https://evil.com",
    type: "text",
  };
  const result = await extractBody(pageUrl, locator, item);
  expect(result).instanceOf(Error);
});
