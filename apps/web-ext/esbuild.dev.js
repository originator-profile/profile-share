const config = require("./esbuild.config");

require("esbuild")
  .build({
    ...config,
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
