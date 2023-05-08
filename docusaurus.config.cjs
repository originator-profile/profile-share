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
  i18n: { locales, defaultLocale: locales[0] },
  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import("@docusaurus/preset-classic").Options} */
      ({
        docs: {
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
        alt: 'Originator Profile Logo',
        src: 'logo.svg',
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
