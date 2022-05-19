const config = require("./esbuild.config");

require("esbuild")
  .build({
    ...config,
    minify: false,
    sourcemap: true,
    define: {
      ...config.define,
      "import.meta.env": JSON.stringify({
        ...JSON.parse(config.define["import.meta.env"]),
        MODE: "development",
        PROFILE_ISSUER: "http://localhost:8080",
      }),
    },
    watch: {
      onRebuild(error, result) {
        if (error) console.error("watch build failed:", error);
        else console.log("watch build succeeded:", result);
      },
    },
  })
  .then(() => {
    console.log("watching...");
  });
