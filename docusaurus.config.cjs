// @ts-check
const mdxMermaid = require("mdx-mermaid");
const pkg = require("./package.json");
const url = pkg.homepage;
const title = pkg.description;
const description = pkg.description;
const githubUrl = pkg.repository;
const locales = ["ja"];

/** @type {import("@docusaurus/types").Config} */
module.exports = {
  url,
  baseUrl: "/",
  favicon: "favicon.png",
  title,
  tagline: description,
  trailingSlash: true,
  i18n: { locales, defaultLocale: locales[0] },
  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import("@docusaurus/preset-classic").Options} */
      ({
        docs: {
          routeBasePath: "/",
          editUrl: `${githubUrl}/blob/main`,
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          remarkPlugins: [mdxMermaid],
        },
      }),
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
  },
};
