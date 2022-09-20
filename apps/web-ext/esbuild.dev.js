const config = require("./esbuild.config");
const { program, Option } = require("commander");

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
      .default("http://localhost:8080")
  );

program.parse(process.argv);
const options = program.opts();

async function dev() {
  await require("esbuild").build({
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
    watch: {
      onRebuild(error, result) {
        if (error) console.error("watch build failed:", error);
        else console.log("watch build succeeded:", result);
      },
    },
  });
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
