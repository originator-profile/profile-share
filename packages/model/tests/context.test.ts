import { test, expect } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import jsonld, { JsonLdDocument } from "jsonld";

test("context.json is valid", async () => {
  const contextJson: Buffer = await fs.readFile(
    path.resolve(__dirname, "../context.json"),
  );
  const context: JsonLdDocument = JSON.parse(contextJson.toString());
  await expect(jsonld.expand(context)).resolves.not.toThrowError();
});

test("sample Profile Set", async () => {
  const profiles: JsonLdDocument = {
    "@context": "https://originator-profile.org/context.jsonld",
    main: ["https://example.org"],
    profile: [
      "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29wci53ZWJkaW5vLm9yZyIsInN1YiI6Imh0dHBzOi8vZXhhbXBsZS5jb20ifQ.xK1KL0pDWdDTyvL1VSuvnPfDZ6zAIJM_Jn8wbNzIi-0",
      "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29wci53ZWJkaW5vLm9yZyIsInN1YiI6Imh0dHBzOi8vZXhhbXBsZS5vcmcifQ.v4udvFAOXwegfbpboDDJgCfanS5htYSodZaBLw-_D8w",
      "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL29wci53ZWJkaW5vLm9yZyIsInN1YiI6Imh0dHBzOi8vZXhhbXBsZS5uZXQifQ.FSEFDg_Qk0-1xQbaTg0407qFXHer1qJNSfI6vuiJTS8",
    ],
    publisher: ["https://example.org"],
    advertiser: ["https://example.com"],
  };
  const expanded = await jsonld.expand(profiles);
  expect(expanded).toMatchSnapshot();
});
