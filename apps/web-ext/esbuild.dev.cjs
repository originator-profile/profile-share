const config = require("./esbuild.config.cjs");
const { program, Option } = require("commander");
const esbuild = require("esbuild");
const path = require("node:path");

program
  .addOption(
    new Option("-t, --target <target>", "The extensions runners to enable")
      .choices(["chromium", "firefox-desktop", "firefox-android"])
      .default("chromium"),
  )
  .addOption(
    new Option("-u, --url <url>", "Launch runner at specified page").default(
      "http://localhost:8080",
      "local profile registry",
    ),
  )
  .addOption(
    new Option("-i, --issuer <issuer>", "Issuer trusted to sign")
      .env("PROFILE_ISSUER")
      .default("localhost"),
  );

program.parse(process.argv);
const options = program.opts();

async function dev() {
  const context = await esbuild.context({
    ...config,
    minify: false,
    sourcemap: true,
    outdir: `dist-${options.target}`,
    define: {
      ...config.define,
      "import.meta.env": JSON.stringify({
        ...JSON.parse(config.define["import.meta.env"]),
        MODE: "development",
        PROFILE_ISSUER: options.issuer,
      }),
    },
    plugins: [
      require("esbuild-copy-static-files")({
        src: "public",
        dest: `dist-${options.target}`,
      }),
      require("./esbuild.postcss.cjs"),
      require("./esbuild.manifest-rename.cjs")({ target: options.target, dist: `dist-${options.target}` }),
    ],
  });
  await context.watch();
  console.log("watching...");
  if (process.env.CI !== "true") {
    const webExt = await import("web-ext");
    await webExt.cmd.run({
      target: options.target,
      sourceDir: path.join(__dirname, `dist-${options.target}`),
      noReload: true,
      startUrl: options.url,
    });
  }
}

dev();
