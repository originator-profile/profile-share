const fs = require("node:fs");
const path = require("node:path");

module.exports = (options = {}) => ({
  name: "copy-manifest-plugin",
  setup(build) {
    let dist = options.dist || "./dist";
    let target = options.target || defaultEnv.TARGET;
    build.onEnd(async () => {
      try {
        fs.renameSync(
          path.join(dist, `manifest-${target}.json`),
          path.join(dist, `manifest.json`),
        );
      } catch (e) {
        console.error("Failed to rename file:", e);
      }
    });
  },
});
