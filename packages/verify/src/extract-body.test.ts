import { describe, beforeAll, test, expect } from "vitest";
import { Window } from "happy-dom";
import { DpText, DpHtml } from "@originator-profile/model";
import { extractBody } from "./extract-body";

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
    const item: DpText = {
      ...base,
      type: "text",
    };
    const result = await extractBody(pageUrl, locator, item);
    expect(result).not.instanceOf(Error);
    expect(result).toBe("Hello, World!NoneGoodbye, World!");
  });

  test("as html type", async () => {
    const item: DpHtml = {
      ...base,
      type: "html",
    };
    const result = await extractBody(pageUrl, locator, item);
    expect(result).not.instanceOf(Error);
    expect(result).toBe(
      '<body><p>Hello, World!</p><p style="display:none">None</p><p>Goodbye, World!</p></body>',
    );
  });

  test("failure when url mismatch", async () => {
    const item: DpText = {
      ...base,
      url: "https://evil.com",
      type: "text",
    };
    const result = await extractBody(pageUrl, locator, item);
    expect(result).instanceOf(Error);
  });
});
