const config = require("./esbuild.config.cjs");
const { program, Option } = require("commander");
const esbuild = require("esbuild");

program
  .addOption(
    new Option("-t, --target <target>", "The extensions runners to enable")
      .choices(["chromium", "firefox-desktop", "firefox-android"])
      .default("chromium"),
  )
  .addOption(
    new Option("-i, --issuer <issuer>", "Issuer trusted to sign")
      .env("PROFILE_ISSUER")
      .default(JSON.parse(config.define["import.meta.env"]).PROFILE_ISSUER),
  );

program.parse(process.argv);
const options = program.opts();

async function build() {
  await esbuild
    .build({
      ...config,
      outdir: `dist-${options.target}`,
      define: {
        ...config.define,
        "import.meta.env": JSON.stringify({
          ...JSON.parse(config.define["import.meta.env"]),
          PROFILE_ISSUER: options.issuer,
        }),
      },
      plugins: [
        require("esbuild-copy-static-files")({
          src: "public",
          dest: `dist-${options.target}`,
        }),
        require("./esbuild.postcss.cjs"),
        require("./esbuild.manifest-rename.cjs")({
          target: options.target,
          dist: `dist-${options.target}`,
        }),
      ],
    })
    .catch(() => process.exit(1));
}
build();
