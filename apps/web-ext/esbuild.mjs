// @ts-check
import util from "node:util";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
const outdir = path.join(
  path.dirname(fileURLToPath(new URL(import.meta.url))),
  `dist-${args.values.target}`,
);
const env = {
  MODE: args.values.mode,
  PROFILE_ISSUER: args.values.issuer,
  PROFILE_REGISTRY_URL: args.values["registry-url"],
};

import { rm } from "node:fs/promises";
// @ts-expect-error
import copy from "esbuild-copy-static-files";
// @ts-expect-error
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
  const runner = await webExt.cmd.run({
    target: args.values.target,
    sourceDir: outdir,
    startUrl: args.values.url,
  });
  await new Promise((r) => runner.registerCleanup(() => r(1)));
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
