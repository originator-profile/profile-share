import { describe, beforeAll, test, expect } from "vitest";
import { Window } from "happy-dom";
import { DpVisibleText, DpText, DpHtml } from "@originator-profile/model";
import { extractBody } from "./extract-body";
import { chromium, firefox, webkit, Locator } from "playwright";

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
const pageUrl = "https://example.com/";

const extractVisibleText = async function (
  locator: (location: string) => Promise<Locale[]>,
) {
  const item: DpVisibleText = {
    ...base,
    type: "visibleText",
  };
  const result = await extractBody(pageUrl, locator, item);
  expect(result).not.instanceOf(Error);
  expect(result).toBe("Hello, World!\n\nGoodbye, World!");
};

const extractText = async function (
  locator: (location: string) => Promise<Locale[]>,
) {
  const item: DpText = {
    ...base,
    type: "text",
  };
  const result = await extractBody(pageUrl, locator, item);
  expect(result).not.instanceOf(Error);
  expect(result).toBe("Hello, World!NoneGoodbye, World!");
};

const extractHtml = async function (
  locator: (location: string) => Promise<Locale[]>,
) {
  const item: DpHtml = {
    ...base,
    type: "html",
  };
  const result = await extractBody(pageUrl, locator, item);
  expect(result).not.instanceOf(Error);
  expect(result).toBe(
    '<body><p>Hello, World!</p><p style="display:none">None</p><p>Goodbye, World!</p></body>',
  );
};

const extractEvil = async function (
  locator: (location: string) => Promise<Locale[]>,
) {
  const item: DpText = {
    ...base,
    url: "https://evil.com",
    type: "text",
  };
  const result = await extractBody(pageUrl, locator, item);
  expect(result).instanceOf(Error);
};

describe("extract body on chromium", () => {
  let locator: (location: string) => Promise<Locator[]>;

  beforeAll(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
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
});

describe("extract body on firefox", () => {
  let locator: (location: string) => Promise<Locator[]>;

  beforeAll(async () => {
    const browser = await firefox.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
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
});

describe("extract body on webkit", () => {
  let locator: (location: string) => Promise<Locator[]>;

  beforeAll(async () => {
    const browser = await webkit.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
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
});

describe("extract body on happy-dom", () => {
  let locator: (location: string) => Promise<HTMLElement[]>;

  beforeAll(async () => {
    const window = new Window();
    const document = window.document as unknown as Document;
    document.body.innerHTML = html;
    document.location.href = pageUrl;
    locator = async (location: string) =>
      Array.from(document.querySelectorAll<HTMLElement>(location));
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
});
