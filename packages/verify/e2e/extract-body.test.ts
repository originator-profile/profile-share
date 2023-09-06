import { test, expect, Locator } from "@playwright/test";
import { DpVisibleText, DpText, DpHtml } from "@originator-profile/model";
import { extractBody } from "../src/extract-body";

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
const pageUrl = "https://example.com/";

const extractVisibleText = async function (
  locator: (location: string) => Promise<Locator[]>,
) {
  const item: DpVisibleText = {
    ...base,
    type: "visibleText",
  };
  const result = await extractBody(pageUrl, locator, item);
  expect(result).not.toBeInstanceOf(Error);
  expect(result).toBe("Hello, World!\n\nGoodbye, World!");
};

const extractText = async function (
  locator: (location: string) => Promise<Locator[]>,
) {
  const item: DpText = {
    ...base,
    type: "text",
  };
  const result = await extractBody(pageUrl, locator, item);
  expect(result).not.toBeInstanceOf(Error);
  expect(result).toBe("Hello, World!NoneGoodbye, World!");
};

const extractHtml = async function (
  locator: (location: string) => Promise<Locator[]>,
) {
  const item: DpHtml = {
    ...base,
    type: "html",
  };
  const result = await extractBody(pageUrl, locator, item);
  expect(result).not.toBeInstanceOf(Error);
  expect(result).toBe(
    '<body><p>Hello, World!</p><p style="display:none">None</p><p>Goodbye, World!</p></body>',
  );
};

const extractEvil = async function (
  locator: (location: string) => Promise<Locator[]>,
) {
  const item: DpText = {
    ...base,
    url: "https://evil.com",
    type: "text",
  };
  const result = await extractBody(pageUrl, locator, item);
  expect(result).toBeInstanceOf(Error);
};

let locator: (location: string) => Promise<Locator[]>;

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  await page.locator("body").evaluate((el, html) => {
    el.innerHTML = html;
  }, html);
  locator = (location: string) => page.locator(location).all();
});

test("as visibleText type", async () => {
  await extractVisibleText(locator);
});

test("as text type", async () => {
  await extractText(locator);
});

test("as html type", async () => {
  await extractHtml(locator);
});

test("failure when url mismatch", async () => {
  await extractEvil(locator);
});
