import { test, expect } from "vitest";
import { stdout } from "stdout-stderr";
import OpenapiGen from "../../src/commands/openapi-gen";

test("openapi-gen", async () => {
  await OpenapiGen.run(["-"]);
  expect(JSON.parse(stdout.output)).toHaveProperty("openapi");
});
