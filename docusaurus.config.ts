import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import * as pkg from "./package.json";

const url = pkg.homepage;
const title = pkg.description;
const description = pkg.description;
const githubUrl = pkg.repository;
const locales = ["ja"];

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
          routeBasePath: "/",
          editUrl: `${githubUrl}/blob/main`,
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
      } satisfies Preset.Options,
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
          href: `${url}/ts/`,
          label: "TSDoc",
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
