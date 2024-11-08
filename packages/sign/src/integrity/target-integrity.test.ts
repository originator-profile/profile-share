import type { Target } from "@originator-profile/model";
import { beforeEach, describe, expect, it } from "vitest";
import { createIntegrityMetadata, type HashAlgorithm } from "websri";
import {
  createIntegrity,
  fetchExternalResource,
  fetchHtmlContent,
  fetchTextContent,
  selectByCss,
  selectByIntegrity,
} from "./target-integrity";

describe("createIntegrity()", () => {
  beforeEach(() => {
    document.body.textContent = "ok";
  });

  it("should return a valid integrity", async () => {
    const integrityMetadata = await createIntegrityMetadata(
      "sha256",
      await new Response("ok").arrayBuffer(),
    );

    expect(
      await createIntegrity("sha256", {
        type: "TextTargetIntegrity",
        cssSelector: "body",
      }),
    ).toEqual({
      type: "TextTargetIntegrity",
      cssSelector: "body",
      integrity: integrityMetadata.toString(),
    });
  });

  it("should return null if type is unsupported", async () => {
    expect(
      await createIntegrity("sha256", {
        type: "UnknownType" as Target["type"],
        cssSelector: "body",
      }),
    ).toBe(null);
  });

  it("should return null if no elements are selected", async () => {
    expect(
      await createIntegrity("sha256", {
        type: "TextTargetIntegrity",
        cssSelector: "non-existent-element",
      }),
    ).toBe(null);
  });

  it("should return null if integrity algorithm is unsupported", async () => {
    expect(
      await createIntegrity("md5" as HashAlgorithm, {
        type: "TextTargetIntegrity",
        cssSelector: "body",
      }),
    ).toBe(null);
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
