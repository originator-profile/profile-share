// @ts-check
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const pkg = await readFile(new URL("./package.json", import.meta.url))
  .then(String)
  .then(JSON.parse);

const base = {
  manifest_version: 3,
  name: pkg.description,
  description: pkg.description,
  version: pkg.version.split("-")[0],
  homepage_url: "https://originator-profile.org/",
  icons: {
    48: "icons/48x48.png",
    128: "icons/128x128.png",
  },
  action: {},
  content_scripts: [
    {
      match_about_blank: true,
      matches: ["<all_urls>"],
      js: ["content-script.js"],
    },
  ],
  web_accessible_resources: [
    {
      matches: ["<all_urls>"],
      resources: ["content-script/iframe.js", "main.css", "*.map"],
    },
  ],
  permissions: ["activeTab"],
};

const chromium = {
  ...base,
  version_name: pkg.version,
  background: {
    service_worker: "background.js",
  },
};

const firefox = {
  ...base,
  browser_specific_settings: {
    gecko: {
      id: "bot@originator-profile.org",
      strict_min_version: "109.0",
    },
    gecko_android: {
      id: "bot@originator-profile.org",
      strict_min_version: "120.0",
    },
  },
  background: {
    page: "background.html",
  },
};

export default function esbuildPluginManifest({ target }) {
  const manifest = {
    chromium,
    "firefox-desktop": firefox,
    "firefox-android": firefox,
  }[target];

  return {
    name: "plugin:manifest",
    setup(build) {
      const dist = build.initialOptions.outdir;
      build.onEnd(async () => {
        await writeFile(
          path.join(dist, "manifest.json"),
          JSON.stringify(manifest, null, 2),
        );
      });
    },
  };
}
