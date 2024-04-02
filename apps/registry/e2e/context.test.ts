import { expect, test } from "vitest";
import jsonld from "jsonld";

test("/context response is a valid JSON-LD context", async () => {
  const res = await fetch("http://localhost:8080/context");
  const json = await res.json();
  await expect(jsonld.expand(json)).resolves.not.toThrowError();
});
