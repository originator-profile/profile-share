import { describe, test, expect } from "vitest";
import { route } from "./routes";

const exampleRoute = route("/a/:b/c/d/:e");

describe("routes", async () => {
  test("routes() returns route path", async () => {
    expect(exampleRoute.path).toBe("/a/:b/c/d/:e");
  });

  test("build() generates path", async () => {
    expect(exampleRoute.build({ b: "b", e: "e" })).toBe("/a/b/c/d/e");
  });

  test("build() throws error if any params not found", async () => {
    // @ts-expect-error assert
    expect(() => exampleRoute.build({ b: "b" })).toThrow();
  });
});
