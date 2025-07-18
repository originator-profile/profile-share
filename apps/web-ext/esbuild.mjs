// @ts-check

import chokidar from "chokidar";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import util from "node:util";

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
              option[1].type === "string" && `=${option[1].toString()}`,
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
/** @type {ImportMeta["env"]["BASIC_AUTH_CREDENTIALS"]} */
let credentials = [];
if (process.env.BASIC_AUTH_CREDENTIALS) {
  credentials = JSON.parse(process.env.BASIC_AUTH_CREDENTIALS);
} else if (args.values.mode === "development") {
  credentials = [
    {
      domain: "localhost",
      username: process.env.BASIC_AUTH_USERNAME ?? "",
      password: process.env.BASIC_AUTH_PASSWORD ?? "",
    },
  ];
}

let registryOps = [];
if (process.env.REGISTRY_OPS) {
  registryOps = JSON.parse(process.env.REGISTRY_OPS);
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
      core: "eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwX1hDazM2dFFrUlpsQnhEckhzMVhldHBUZUZYdDRfVlRSbHlEa0YyQWsiLCJ0eXAiOiJ2Yytqd3QiLCJjdHkiOiJ2YyJ9.eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvbnMvY3JlZGVudGlhbHMvdjIiLCJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvbnMvY3JlZGVudGlhbHMvdjEiXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIkNvcmVQcm9maWxlIl0sImlzc3VlciI6ImRuczpvcHJleHB0Lm9yaWdpbmF0b3ItcHJvZmlsZS5vcmciLCJjcmVkZW50aWFsU3ViamVjdCI6eyJpZCI6ImRuczpvcHJleHB0Lm9yaWdpbmF0b3ItcHJvZmlsZS5vcmciLCJ0eXBlIjoiQ29yZSIsImp3a3MiOnsia2V5cyI6W3sia3R5IjoiRUMiLCJraWQiOiIyMF9YQ2szNnRRa1JabEJ4RHJIczFYZXRwVGVGWHQ0X1ZUUmx5RGtGMkFrIiwieCI6IjNoYV84MTBZcmlNTi1rMzFkanY5SUFlMng3MWV3d0U0WGhyb2xsOGQxNFkiLCJ5IjoiSGh0R09YMnI3U3p6aTlGTDFIQ1l6N2lCckExaE96a25mSDNIb0NwSTFmayIsImNydiI6IlAtMjU2In1dfX0sImlzcyI6ImRuczpvcHJleHB0Lm9yaWdpbmF0b3ItcHJvZmlsZS5vcmciLCJzdWIiOiJkbnM6b3ByZXhwdC5vcmlnaW5hdG9yLXByb2ZpbGUub3JnIiwiaWF0IjoxNzM0NDQ1NDgwLCJleHAiOjE3NjU5ODE0ODB9.xoXG-uPdrMp1_wJ0nxnYr9p4SeQWc_531AGN7-Ke81K0cY3ucdzy0YhVvEhoiicm-yBlAcGHBfFaxJ3sFGnjLg",
      media:
        "eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwX1hDazM2dFFrUlpsQnhEckhzMVhldHBUZUZYdDRfVlRSbHlEa0YyQWsiLCJ0eXAiOiJ2Yytqd3QiLCJjdHkiOiJ2YyJ9.eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvbnMvY3JlZGVudGlhbHMvdjIiLCJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvbnMvY3JlZGVudGlhbHMvdjEiLCJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvbnMvY2lwL3YxIix7IkBsYW5ndWFnZSI6ImphLUpQIn1dLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiV2ViTWVkaWFQcm9maWxlIl0sImlzc3VlciI6ImRuczpvcHJleHB0Lm9yaWdpbmF0b3ItcHJvZmlsZS5vcmciLCJjcmVkZW50aWFsU3ViamVjdCI6eyJpZCI6ImRuczpvcHJleHB0Lm9yaWdpbmF0b3ItcHJvZmlsZS5vcmciLCJ0eXBlIjoiT25saW5lQnVzaW5lc3MiLCJ1cmwiOiJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvIiwibmFtZSI6Ik9yaWdpbmF0b3IgUHJvZmlsZSDmioDooZPnoJTnqbbntYTlkIgiLCJsb2dvIjp7ImlkIjoiaHR0cHM6Ly9vcmlnaW5hdG9yLXByb2ZpbGUub3JnL2Zhdmljb24uc3ZnIiwiZGlnZXN0U1JJIjoic2hhMjU2LWI5V1FaL1RxNHRteWUwaXVwd3ZrZlVMT0Fyazg2NnJvQjlLZDZZTXhUSGs9In0sImNvbnRhY3RQb2ludCI6eyJpZCI6Imh0dHBzOi8vb3JpZ2luYXRvci1wcm9maWxlLm9yZy9qYS1KUC9jb250YWN0LyIsIm5hbWUiOiLjgYrllY_jgYTlkIjjgo_jgZsifSwicHJpdmFjeVBvbGljeSI6eyJpZCI6Imh0dHBzOi8vb3JpZ2luYXRvci1wcm9maWxlLm9yZy9qYS1KUC9wcml2YWN5LyIsIm5hbWUiOiLjg5fjg6njgqTjg5Djgrfjg7zjg53jg6rjgrfjg7wifX0sImlzcyI6ImRuczpvcHJleHB0Lm9yaWdpbmF0b3ItcHJvZmlsZS5vcmciLCJzdWIiOiJkbnM6b3ByZXhwdC5vcmlnaW5hdG9yLXByb2ZpbGUub3JnIiwiaWF0IjoxNzM2NDk1NjcwLCJleHAiOjE3NjgwMzE2NzB9.grI9O_N5glwsB_pNA69r9wtPcfGzwHh0hJ8rLSjK9r1pTFdY8vdXEgowoVXaC9ryE68I9SlrButet9fRutSvfg",
    },
    {
      core: signedCoreProfile,
    },
  ];
}

const env = {
  MODE: args.values.mode,
  BASIC_AUTH: process.env.BASIC_AUTH === "true",
  BASIC_AUTH_CREDENTIALS: process.env.BASIC_AUTH === "true" ? credentials : [],
  REGISTRY_OPS: registryOps,
};

if (env.BASIC_AUTH && env.BASIC_AUTH_CREDENTIALS.length === 0) {
  throw new Error(
    "BASIC_AUTH is enabled but BASIC_AUTH_CREDENTIALS is not set. Please set BASIC_AUTH_CREDENTIALS environment variable.",
  );
}

if (env.REGISTRY_OPS.length === 0) {
  console.warn(
    "REGISTRY_OPS is empty. Please set REGISTRY_OPS environment variable.",
  );

  if (process.env.CI) process.exit(1);
}

import esbuild from "esbuild";
import copy from "esbuild-copy-static-files";
import { rm } from "node:fs/promises";
// @ts-expect-error: 型定義がない
import webExt from "web-ext";
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
  conditions: ["browser", "typescript"],
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
      void ctx.rebuild();
    })
    .on("change", (path) => {
      console.log(`File ${path} has been changed`);
      void ctx.rebuild();
    })
    .on("unlink", (path) => {
      console.log(`File ${path} has been removed`);
      void ctx.rebuild();
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
