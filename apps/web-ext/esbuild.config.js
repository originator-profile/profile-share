const defaultEnv = {
  MODE: "production",
  PROFILE_ISSUER: process.env.PROFILE_ISSUER ?? "https://oprdev.herokuapp.com",
};

/** @type {import("esbuild").BuildOptions} */
module.exports = {
  target: "es2015",
  entryPoints: [
    "src/main.tsx",
    "src/background.ts",
    "src/content-script.ts",
    "src/content-script/iframe.tsx",
  ],
  outdir: "dist",
  color: true,
  bundle: true,
  minify: true,
  define: { "import.meta.env": JSON.stringify(defaultEnv) },
  jsx: "automatic",
  plugins: [
    require("esbuild-copy-static-files")({ src: "public", dest: "dist" }),
    require("./esbuild.postcss"),
  ],
};
