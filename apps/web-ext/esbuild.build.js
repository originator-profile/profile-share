const config = require("./esbuild.config");

require("esbuild")
  .build(config)
  .catch(() => process.exit(1));
