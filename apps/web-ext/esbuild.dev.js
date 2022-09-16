const config = require("./esbuild.config");
const { program } = require("commander");

program
  .option("-t, --target <target>", "The extensions runners to enable")
  .option("-u, --url <url>", "Launch runner at specified page")
  .option("-i, --issuer <issuer>", "Issuer trusted to sign");
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
        PROFILE_ISSUER:
          options.issuer ??
          process.env.PROFILE_ISSUER ??
          "http://localhost:8080",
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
    target: options.target ?? "chromium",
    sourceDir: "dist",
    noReload: true,
    startUrl: options.url ?? "http://localhost:8080",
  });
}

dev();
