import { RawTarget } from "@originator-profile/model";
import { describe, expect, it } from "vitest";
import { fetchAndSetTargetIntegrity } from "./fetch-and-set-target-integrity";

describe("fetchAndSetTargetIntegrity()", () => {
  it("should update the target array with integrity", async () => {
    document.body.textContent = "ok";

    const uca = {
      target: [
        {
          type: "TextTargetIntegrity",
          cssSelector: "body",
        } satisfies RawTarget,
      ],
    };

    await fetchAndSetTargetIntegrity("sha256", uca);

    expect(uca.target).toEqual([
      {
        type: "TextTargetIntegrity",
        cssSelector: "body",
        integrity: "sha256-Jok2eyBcFs4y7UIAlCuLix4mLfxw2byfvHfElpmk8d8=",
      },
    ]);
  });

  it("should throw an error if createIntegrity() returns null", async () => {
    const uca = {
      target: [
        {
          type: "TextTargetIntegrity",
          cssSelector: "non-existent-element",
        } satisfies RawTarget,
      ],
    };

    await expect(
      fetchAndSetTargetIntegrity("sha256", uca),
    ).rejects.toThrowError(`Failed to create integrity #0.`);
  });
});
