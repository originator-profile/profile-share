import { test } from "vitest";
import { expand } from "jsonld";

test("/.well-known/ps.json response is a valid JSON-LD", async () => {
  const res = await fetch("http://localhost:8080/.well-known/ps.json");
  const json = await res.json();
  await expand(json);
});
