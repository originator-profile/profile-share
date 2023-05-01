const config = require("./esbuild.config.cjs");

require("esbuild")
  .build(config)
  .catch(() => process.exit(1));
