import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import search from "@easyops-cn/docusaurus-search-local";
import * as pkg from "./package.json";

const url = pkg.homepage;
const title = pkg.description;
const description = pkg.description;
const githubUrl = pkg.repository;
const locales = ["ja"];
const docsRouteBasePath = "/";

export default {
  url,
  baseUrl: "/",
  favicon: "favicon.png",
  title,
  tagline: description,
  trailingSlash: true,
  i18n: { locales, defaultLocale: locales[0] },
  markdown: {
    format: "detect",
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          routeBasePath: docsRouteBasePath,
          editUrl: `${githubUrl}/blob/main`,
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    [
      search,
      {
        docsRouteBasePath,
        language: [...locales, "en"],
      } satisfies search.PluginOptions,
    ],
  ],
  themeConfig: {
    navbar: {
      logo: {
        alt: "Originator Profile Logo",
        src: "logo.svg",
        srcDark: "logoDark.svg",
      },
      items: [
        {
          href: "pathname:///ts/",
          label: "TSDoc",
          position: "right",
        },
        {
          href: "pathname:///api/",
          label: "API",
          position: "right",
        },
        {
          href: githubUrl,
          label: "GitHub",
          position: "right",
        },
      ],
    },
  } satisfies Preset.ThemeConfig,
} satisfies Config;
