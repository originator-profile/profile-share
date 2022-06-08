import { describe, test, expect } from "vitest";
import { param, route } from "./routes";

const exampleRoute = route("a", param("b"), "c", "d", param("e"));

describe("routes", async () => {
  test("routes() returns route path", async () => {
    expect(exampleRoute.path).toBe("/a/:b/c/d/:e");
  });

  test("toPath() generates path", async () => {
    expect(exampleRoute.toPath({ b: "b", e: "e" })).toBe("/a/b/c/d/e");
  });

  test("toPath() throws error if any params not found", async () => {
    expect(() => exampleRoute.toPath({ b: "b" })).toThrow();
  });
});
