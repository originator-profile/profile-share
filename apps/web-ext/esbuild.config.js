module.exports = {
  target: "es2015",
  entryPoints: ["src/main.tsx", "src/background.ts", "src/contentScript.ts"],
  outdir: "dist",
  color: true,
  bundle: true,
  minify: true,
  sourcemap: process.env.NODE_ENV === "development",
  inject: ['src/react-shim.ts'],
  plugins: [
    require("esbuild-copy-static-files")({ src: "public", dest: "dist" }),
    require("./esbuild.postcss")
  ],
};
