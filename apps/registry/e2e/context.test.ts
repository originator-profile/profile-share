import { test } from "vitest";
import { expand } from "jsonld";

test("/context response is a valid JSON-LD context", async () => {
  const res = await fetch("http://localhost:8080/context");
  const json = await res.json();
  await expand(json);
});
