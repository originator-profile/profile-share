import { test } from "vitest";
import jsonld from "jsonld";

test("/.well-known/ps.json response is a valid JSON-LD", async () => {
  const res = await fetch("http://localhost:8080/.well-known/ps.json");
  const json = await res.json();
  await jsonld.expand(json);
});
