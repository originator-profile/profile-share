import { Target } from "@originator-profile/model";
import { createIntegrity } from "@originator-profile/sign";
import { beforeEach, describe, expect, it } from "vitest";
import { createIntegrityMetadata } from "websri";
import { verifyIntegrity } from "./target-integrity";

describe("verifyIntegrity()", () => {
  beforeEach(() => {
    document.body.textContent = "ok";
  });

  it("should return true when integrity matches", async () => {
    const content = await createIntegrity("sha256", {
      type: "TextTargetIntegrity",
      cssSelector: "body",
    });

    const result = await verifyIntegrity(content as Target);
    expect(result.valid).toBe(true);
  });

  it("should return false if integrity algorithm is unsupported", async () => {
    const content: Target = {
      type: "TextTargetIntegrity",
      cssSelector: "body",
      integrity: "md5-REvLOj/Pg4kpbElGfyfh1g==",
    };

    const result = await verifyIntegrity(content);
    expect(result.valid).toBe(false);
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

    const result = await verifyIntegrity(content);
    expect(result.valid).toBe(false);
  });

  it("should verify ExternalResourceTargetIntegrity using src attribute", async () => {
    const svgData = await fetch(
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==",
    ).then((res) => res.arrayBuffer());
    const integrityMetadata = await createIntegrityMetadata("sha256", svgData);

    document.body.innerHTML = `\
<img integrity="${integrityMetadata.toString()}" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==" />
`;

    const content: Target = {
      type: "ExternalResourceTargetIntegrity",
      integrity: integrityMetadata.toString(),
    };

    const result = await verifyIntegrity(content);
    expect(result.valid).toBe(true);
  });

  it("should verify ExternalResourceTargetIntegrity using currentSrc when available", async () => {
    const currentSrcData = await fetch(
      "data:text/plain,currentSrc-content",
    ).then((res) => res.arrayBuffer());
    const integrityMetadata = await createIntegrityMetadata(
      "sha256",
      currentSrcData,
    );

    document.body.innerHTML = `\
<img integrity="${integrityMetadata.toString()}" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==" />
`;

    const element = document.querySelector(
      `[integrity="${integrityMetadata.toString()}"]`,
    ) as HTMLImageElement;

    // Mock currentSrc to simulate HTMLImageElement behavior
    // This simulates a responsive image that selected a different source
    Object.defineProperty(element, "currentSrc", {
      value: "data:text/plain,currentSrc-content",
      configurable: true,
    });

    const content: Target = {
      type: "ExternalResourceTargetIntegrity",
      integrity: integrityMetadata.toString(),
    };

    const result = await verifyIntegrity(content);
    expect(result.valid).toBe(true);
  });

  it("should verify ExternalResourceTargetIntegrity and fallback to src when currentSrc is empty", async () => {
    const fallbackData = await fetch("data:text/plain,fallback-content").then(
      (res) => res.arrayBuffer(),
    );
    const integrityMetadata = await createIntegrityMetadata(
      "sha256",
      fallbackData,
    );

    document.body.innerHTML = `\
<img integrity="${integrityMetadata.toString()}" src="data:text/plain,fallback-content" />
`;

    const element = document.querySelector(
      `[integrity="${integrityMetadata.toString()}"]`,
    ) as HTMLImageElement;

    // Mock currentSrc as empty string to test fallback to src
    Object.defineProperty(element, "currentSrc", {
      value: "",
      configurable: true,
    });

    const content: Target = {
      type: "ExternalResourceTargetIntegrity",
      integrity: integrityMetadata.toString(),
    };

    const result = await verifyIntegrity(content);
    expect(result.valid).toBe(true);
  });
});
