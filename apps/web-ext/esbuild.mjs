// @ts-check
import path from "node:path";
import util from "node:util";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import chokidar from "chokidar";

const options = /** @type {const} */ ({
  mode: {
    type: "string",
    default: "production",
    toString() {
      return `production|development (default: ${this.default})`;
    },
  },
  target: {
    type: "string",
    short: "t",
    default: "chromium",
    toString() {
      return `chromium|firefox-desktop|firefox-android (default: ${this.default})`;
    },
  },
  issuer: {
    type: "string",
    short: "i",
    default: process.env.PROFILE_ISSUER ?? "oprexpt.originator-profile.org",
    toString() {
      return `<issuer> (default: ${this.default})`;
    },
  },
  ["registry-url"]: {
    type: "string",
    short: "r",
    default:
      process.env.PROFILE_REGISTRY_URL ??
      "https://oprexpt.originator-profile.org/",
    toString() {
      return `<registry-url> (default: ${this.default})`;
    },
  },
  url: {
    type: "string",
    short: "u",
    default: "http://localhost:8080/app/debugger",
    toString() {
      return `<watch_url> (default: ${this.default}, development mode only)`;
    },
  },
  help: {
    type: "boolean",
    short: "h",
    run() {
      console.log(
        [
          "Available options:",
          ...Object.entries(options).map((option) =>
            [
              `  --${option[0]}`,
              "short" in option[1] && ` -${option[1].short}`,
              option[1].type === "string" && `=${option[1]}`,
            ]
              .filter(Boolean)
              .join(""),
          ),
        ].join("\n"),
      );
    },
  },
});

const args = util.parseArgs({ options });

if (args.values.help) {
  options.help.run();
  process.exit();
}

const filename = `{name}-${args.values.target}-{version}.zip`;
const artifactsDir = "web-ext-artifacts";
const cwd = path.dirname(fileURLToPath(new URL(import.meta.url)));
const outdir = path.join(cwd, `dist-${args.values.target}`);
const credentialsPath = path.join(cwd, "credentials.json");
/** @type {ImportMeta["env"]["BASIC_AUTH_CREDENTIALS"]} */
let credentials = [];
if (existsSync(credentialsPath)) {
  const file = readFileSync(credentialsPath, { encoding: "utf8" });
  credentials = JSON.parse(file);
} else if (args.values.mode === "development") {
  credentials = [
    {
      domain: args.values.issuer ?? "",
      username: process.env.BASIC_AUTH_USERNAME ?? "",
      password: process.env.BASIC_AUTH_PASSWORD ?? "",
    },
  ];
}

const registryOpsPath = path.join(cwd, "registry-ops.json");
let registryOps = [];
if (existsSync(registryOpsPath)) {
  const file = readFileSync(registryOpsPath, { encoding: "utf8" });
  registryOps = JSON.parse(file);
} else if (args.values.mode === "development") {
  const privKeyPath = path.join(
    cwd,
    "../registry/account-key.example.priv.json",
  );
  const commandBinaryPath = path.join(cwd, "../registry/bin/run");
  const cpPath = path.join(cwd, "../registry/cp.example.json");
  const signedCoreProfile = execSync(
    `${commandBinaryPath} sign -i ${privKeyPath} --input ${cpPath} --id localhost`,
  )
    .toString()
    .trim();
  registryOps = [
    {
      core: signedCoreProfile,
    },
  ];
}

const env = {
  MODE: args.values.mode,
  PROFILE_ISSUER: args.values.issuer,
  PROFILE_REGISTRY_URL: args.values["registry-url"],
  BASIC_AUTH: process.env.BASIC_AUTH === "true",
  BASIC_AUTH_CREDENTIALS: process.env.BASIC_AUTH === "true" ? credentials : [],
  REGISTRY_OPS: registryOps,
};

import { rm } from "node:fs/promises";
import copy from "esbuild-copy-static-files";
// @ts-expect-error: 型定義がない
import webExt from "web-ext";
import esbuild from "esbuild";
import postcss from "./esbuild.postcss.cjs";
import manifest from "./manifest.mjs";

/** @type {import("esbuild").BuildOptions} */
const buildOptions = {
  target: "es2018",
  entryPoints: [
    "src/main.tsx",
    "src/background.ts",
    "src/content-script.ts",
    "src/content-script/iframe.tsx",
    "src/content-script-all-frames.ts",
  ],
  outdir,
  color: true,
  bundle: true,
  minify: args.values.mode === "production",
  sourcemap: args.values.mode === "development",
  define: {
    "import.meta.env": JSON.stringify(env),
  },
  jsx: "automatic",
  loader: {
    ".png": "dataurl",
    ".svg": "dataurl",
  },
  plugins: [
    copy({
      src: "public",
      dest: outdir,
    }),
    postcss,
    manifest({
      target: args.values.target,
    }),
  ],
};

await rm(outdir, {
  force: true,
  recursive: true,
});

await esbuild.build(buildOptions);

const watch = Boolean(
  args.values.mode === "development" &&
    args.values.url &&
    process.env.CI !== "true",
);

if (watch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log("watching...");
  const watcher = chokidar.watch("./public");
  watcher
    .on("add", (path) => {
      console.log(`File ${path} has been added`);
      ctx.rebuild();
    })
    .on("change", (path) => {
      console.log(`File ${path} has been changed`);
      ctx.rebuild();
    })
    .on("unlink", (path) => {
      console.log(`File ${path} has been removed`);
      ctx.rebuild();
    });

  const runner = await webExt.cmd.run({
    target: args.values.target,
    sourceDir: outdir,
    startUrl: args.values.url,
  });
  await new Promise((r) => {
    runner.registerCleanup(() => r(1));
  });
} else {
  await webExt.cmd.build({
    target: args.values.target,
    sourceDir: outdir,
    filename,
    artifactsDir,
    overwriteDest: true,
  });
}

process.exit();
