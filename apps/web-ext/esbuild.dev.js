const config = require("./esbuild.config");
const { program, Option } = require("commander");
const esbuild = require("esbuild");

program
  .addOption(
    new Option("-t, --target <target>", "The extensions runners to enable")
      .choices(["chromium", "firefox-desktop", "firefox-android"])
      .default("chromium")
  )
  .addOption(
    new Option("-u, --url <url>", "Launch runner at specified page").default(
      "http://localhost:8080",
      "local profile registry"
    )
  )
  .addOption(
    new Option("-i, --issuer <issuer>", "Issuer trusted to sign")
      .env("PROFILE_ISSUER")
      .default("localhost")
  );

program.parse(process.argv);
const options = program.opts();

async function dev() {
  const context = await esbuild.context({
    ...config,
    minify: false,
    sourcemap: true,
    define: {
      ...config.define,
      "import.meta.env": JSON.stringify({
        ...JSON.parse(config.define["import.meta.env"]),
        MODE: "development",
        PROFILE_ISSUER: options.issuer,
      }),
    },
  });
  await context.watch();
  console.log("watching...");
  const webExt = await import("web-ext");
  webExt.cmd.run({
    target: options.target,
    sourceDir: "dist",
    noReload: true,
    startUrl: options.url,
  });
}

dev();
