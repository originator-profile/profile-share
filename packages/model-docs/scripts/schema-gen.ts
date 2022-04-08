import fs from "node:fs/promises";
import path from "node:path";
import rimraf from "rimraf";
import op from "@webdino/profile-model/src/op";
import dp from "@webdino/profile-model/src/dp";

const out = "dist";
const schemas = {
  op,
  dp,
};

async function main() {
  rimraf.sync(out);
  await fs.mkdir(out, { recursive: true });

  const ops = [...Object.entries(schemas)].map(([name, schema]) => {
    return fs.writeFile(
      path.resolve(out, `${name}.schema.json`),
      JSON.stringify(schema, null, 2)
    );
  });

  await Promise.all(ops);
}

main();
