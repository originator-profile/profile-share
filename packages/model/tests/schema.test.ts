import { test, expect } from "vitest";
import Ajv from "ajv";
import Op from "../src/op";
import Dp from "../src/dp";

test("op schema is valid", async () => {
  const ajv = new Ajv();
  const valid = ajv.validateSchema(Op);
  expect(valid).toBe(true);
});

test("dp schema is valid", async () => {
  const ajv = new Ajv();
  const valid = ajv.validateSchema(Dp);
  expect(valid).toBe(true);
});
