const defaultEnv = {
  MODE: "production",
  PROFILE_ISSUER: "https://oprdev.herokuapp.com",
};

module.exports = {
  target: "es2015",
  entryPoints: ["src/main.tsx", "src/background.ts", "src/contentScript.ts"],
  outdir: "dist",
  color: true,
  bundle: true,
  minify: true,
  define: { "import.meta.env": JSON.stringify(defaultEnv) },
  inject: ["src/react-shim.ts"],
  plugins: [
    require("esbuild-copy-static-files")({ src: "public", dest: "dist" }),
    require("./esbuild.postcss"),
  ],
};
