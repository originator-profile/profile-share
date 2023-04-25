import fs from "node:fs/promises";
import path from "node:path";
import { rimraf } from "rimraf";
import kebabCase from "just-kebab-case";
import { Profile } from "@webdino/profile-model";

const out = "dist";
const schemas = { Profile };

async function main() {
  await rimraf(out);
  await fs.mkdir(out, { recursive: true });

  const ops = [...Object.entries(schemas)].map(async ([name, schema]) => {
    const id = kebabCase(name);
    const outfile = path.resolve(out, `${id}.schema.json`);
    const json = JSON.stringify({ ...schema, $id: id });
    await fs.writeFile(outfile, json);
  });

  await Promise.all(ops);
}

main();
