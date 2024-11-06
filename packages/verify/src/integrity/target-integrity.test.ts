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

    expect(await verifyIntegrity(content as Target)).toBe(true);
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
