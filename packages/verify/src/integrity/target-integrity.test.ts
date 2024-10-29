import { Target } from "@originator-profile/model";
import { beforeEach, describe, expect, it } from "vitest";
import { createIntegrityMetadata } from "websri";
import {
  fetchExternalResource,
  fetchHtmlContent,
  fetchTextContent,
  selectByCss,
  selectByIntegrity,
  verifyIntegrity,
} from "./target-integrity";

describe("verifyIntegrity()", () => {
  beforeEach(() => {
    document.body.textContent = "ok";
  });

  it("should return true when integrity matches", async () => {
    const integrityMetadata = await createIntegrityMetadata(
      "sha256",
      await new Response("ok").arrayBuffer(),
    );

    const content: Target = {
      type: "TextTargetIntegrity",
      cssSelector: "body",
      integrity: integrityMetadata.toString(),
    };

    expect(await verifyIntegrity(content)).toBe(true);
  });

  it("should return false if integrity algorithm is unsupported", async () => {
    const content: Target = {
      type: "TextTargetIntegrity",
      cssSelector: "body",
      integrity: "md5-REvLOj/Pg4kpbElGfyfh1g==",
    };

    expect(await verifyIntegrity(content)).toBe(false);
  });

  it("should return false if no elements are selected", async () => {
    const integrityMetadata = await createIntegrityMetadata(
      "sha256",
      await new Response("ok").arrayBuffer(),
    );

    const content: Target = {
      type: "TextTargetIntegrity",
      cssSelector: "non-existent-element",
      integrity: integrityMetadata.toString(),
    };

    expect(await verifyIntegrity(content)).toBe(false);
  });
});

describe("fetchHtmlContent()", () => {
  beforeEach(() => {
    document.body.innerHTML = `
<h1>Example Page</h1>
<p>Hello, World!</p>
`;
  });

  it("should fetch outerHTML", async () => {
    const elements = selectByCss({
      cssSelector: "body",
      integrity: "sha256-xxx",
      document,
    });

    const [res] = await fetchHtmlContent(elements);

    expect(await res.text()).toBe(
      `\
<body>
<h1>Example Page</h1>
<p>Hello, World!</p>
</body>`,
    );
  });

  it("should fetch outerHTML of all elements", async () => {
    const elements = selectByCss({
      cssSelector: "body > *",
      integrity: "sha256-xxx",
      document,
    });

    const [res] = await fetchHtmlContent(elements);

    expect(await res.text()).toBe(`<h1>Example Page</h1><p>Hello, World!</p>`);
  });
});

describe("fetchTextContent()", () => {
  beforeEach(() => {
    document.body.innerHTML = `
<h1>Example Page</h1>
<p>Hello, World!</p>
`;
  });

  it("should fetch textContent", async () => {
    const elements = selectByCss({
      cssSelector: "body",
      integrity: "sha256-xxx",
      document,
    });

    const [res] = await fetchTextContent(elements);

    expect(await res.text()).toBe(
      `\

Example Page
Hello, World!
`,
    );
  });

  it("should fetch textContent of all elements", async () => {
    const elements = selectByCss({
      cssSelector: "body > *",
      integrity: "sha256-xxx",
      document,
    });

    const [res] = await fetchTextContent(elements);

    expect(await res.text()).toBe(`Example PageHello, World!`);
  });
});

describe("fetchVisibleTextContent()", () => {
  it("should fetch innerText", async () => {
    document.body.textContent = `Hello, World!`;

    const elements = selectByCss({
      cssSelector: "body",
      integrity: "sha256-xxx",
      document,
    });

    const [res] = await fetchTextContent(elements);

    expect(await res.text()).toBe(`Hello, World!`);
  });
});

describe("fetchExternalResource()", () => {
  it("should fetch external resources using src attribute", async () => {
    document.body.innerHTML = `\
<img integrity="sha256-xxx" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==" />
`;

    const elements = selectByIntegrity({
      integrity: "sha256-xxx",
      document,
    });

    const [res] = await fetchExternalResource(elements);

    expect(await res.text()).toBe(
      `<svg xmlns="http://www.w3.org/2000/svg"></svg>`,
    );
  });
});

describe("selectByCss()", () => {
  beforeEach(() => {
    document.documentElement.outerHTML = `<html><head></head><body>ok</body></html>`;
  });

  it("should select elements using CSS selector", async () => {
    const elements = selectByCss({
      cssSelector: "body",
      integrity: "sha256-xxx",
      document,
    });

    expect(elements).toHaveLength(1);
    expect(elements[0].outerHTML).toBe(`<body>ok</body>`);
  });

  it("should return an empty array if no CSS selector is provided", async () => {
    const elements = selectByCss({
      integrity: "sha256-xxx",
      document,
    });

    expect(elements).toEqual([]);
  });

  it("should return an empty array if no elements match the CSS selector", async () => {
    const elements = selectByCss({
      cssSelector: "non-existent-element",
      integrity: "sha256-xxx",
      document,
    });

    expect(elements).toEqual([]);
  });
});

describe("selectByIntegrity()", () => {
  beforeEach(() => {
    document.body.innerHTML = `\
<img integrity="sha256-xxx" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==" />
`;
  });

  it("should select elements with matching integrity attribute", async () => {
    const elements = selectByIntegrity({
      integrity: "sha256-xxx",
      document,
    });

    expect(elements).toHaveLength(1);
    expect(elements[0].outerHTML).toBe(
      `<img integrity="sha256-xxx" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==">`,
    );
  });

  it("should return an empty array if no elements match the integrity", async () => {
    const elements = selectByIntegrity({
      integrity: "sha256-existent-integrity",
      document,
    });

    expect(elements).toEqual([]);
  });
});
