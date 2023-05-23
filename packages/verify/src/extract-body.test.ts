import { test, expect } from "vitest";
import { Window } from "happy-dom";
import { DpVisibleText, DpText, DpHtml } from "@webdino/profile-model";
import { extractBody } from "./extract-body";
import { chromium, firefox, webkit, Locator, Page } from "playwright";

type Locale = HTMLElement | Locator;

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

const extractVisibleText = async function (page: Page) {
  const item: DpVisibleText = {
    ...base,
    type: "visibleText",
  };
  await page.locator("body").evaluate((el, html) => {
    el.innerHTML = html;
  }, html);
  const result = await extractBody(
    pageUrl,
    (location) => page.locator(location).all(),
    item
  );
  expect(result).not.instanceOf(Error);
  expect(result).toBe("Hello, World!\n\nGoodbye, World!");
};

test("extract body as visibleText type on chromium", async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await extractVisibleText(await context.newPage());
});

test("extract body as visibleText type on firefox", async () => {
  const browser = await firefox.launch();
  const context = await browser.newContext();
  await extractVisibleText(await context.newPage());
});

test("extract body as visibleText type on webkit", async () => {
  const browser = await webkit.launch();
  const context = await browser.newContext();
  await extractVisibleText(await context.newPage());
});

const extractText = async function (
  locator: (location: string) => Promise<Locale[]>
) {
  const item: DpText = {
    ...base,
    type: "text",
  };
  const result = await extractBody(pageUrl, locator, item);
  expect(result).not.instanceOf(Error);
  expect(result).toBe("Hello, World!NoneGoodbye, World!");
};

test("extract body as text type on happy-dom", async () => {
  await extractText(locator);
});

test("extract body as text type on chromium", async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.locator("body").evaluate((el, html) => {
    el.innerHTML = html;
  }, html);
  await extractText((location) => page.locator(location).all());
});

test("extract body as text type on firefox", async () => {
  const browser = await firefox.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.locator("body").evaluate((el, html) => {
    el.innerHTML = html;
  }, html);
  await extractText((location) => page.locator(location).all());
});

test("extract body as text type on webkit", async () => {
  const browser = await webkit.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.locator("body").evaluate((el, html) => {
    el.innerHTML = html;
  }, html);
  await extractText((location) => page.locator(location).all());
});

const extractHtml = async function (
  locator: (location: string) => Promise<Locale[]>
) {
  const item: DpHtml = {
    ...base,
    type: "html",
  };
  const result = await extractBody(pageUrl, locator, item);
  expect(result).not.instanceOf(Error);
  expect(result).toBe(
    '<body><p>Hello, World!</p><p style="display:none">None</p><p>Goodbye, World!</p></body>'
  );
};

test("extract body as html type on happy-dom", async () => {
  await extractHtml(locator);
});

test("extract body as html type on chromium", async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.locator("body").evaluate((el, html) => {
    el.innerHTML = html;
  }, html);
  await extractHtml((location) => page.locator(location).all());
});

test("extract body as html type on firefox", async () => {
  const browser = await firefox.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.locator("body").evaluate((el, html) => {
    el.innerHTML = html;
  }, html);
  await extractHtml((location) => page.locator(location).all());
});

test("extract body as html type on webkit", async () => {
  const browser = await webkit.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.locator("body").evaluate((el, html) => {
    el.innerHTML = html;
  }, html);
  await extractHtml((location) => page.locator(location).all());
});

const extractEvil = async function (
  locator: (location: string) => Promise<Locale[]>
) {
  const item: DpText = {
    ...base,
    url: "https://evil.com",
    type: "text",
  };
  const result = await extractBody(pageUrl, locator, item);
  expect(result).instanceOf(Error);
};

test("extract body failure when url mismatch on happy-dom", async () => {
  await extractEvil(locator);
});

test("extract body failure when url mismatch on chromium", async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.locator("body").evaluate((el, html) => {
    el.innerHTML = html;
  }, html);
  await extractEvil((location) => page.locator(location).all());
});

test("extract body failure when url mismatch on firefox", async () => {
  const browser = await firefox.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.locator("body").evaluate((el, html) => {
    el.innerHTML = html;
  }, html);
  await extractEvil((location) => page.locator(location).all());
});

test("extract body failure when url mismatch on webkit", async () => {
  const browser = await webkit.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.locator("body").evaluate((el, html) => {
    el.innerHTML = html;
  }, html);
  await extractEvil((location) => page.locator(location).all());
});
