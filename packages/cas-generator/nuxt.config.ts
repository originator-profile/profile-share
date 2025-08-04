import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxt/icon"],
  devServer: {
    port: 4000,
  },
  telemetry: false,
  vite: {
    // @ts-expect-error
    plugins: [tailwindcss()],
  },
  css: ["~/assets/css/tailwind.css"],

  // サーバーサイドで環境変数を使用するための設定
  runtimeConfig: {
    // CAS連携用の環境変数
    WEBROOT_PATH: process.env.WEBROOT_PATH,
    VC_OUTPUT_PATH: process.env.VC_OUTPUT_PATH,
    CAS_OUTPUT_PATH: process.env.CAS_OUTPUT_PATH,
    PRIVATE_KEY_PATH: process.env.PRIVATE_KEY_PATH,
    // Authorization　Code Flowに必要な環境変数
    ISSUER: process.env.ISSUER,
    AUTHORIZATION_ENDPOINT: process.env.AUTHORIZATION_ENDPOINT,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    REDIRECT_URI: process.env.REDIRECT_URI,
  },

  // NOTE: unenv@2.0.0-rc.15 + cloudflare の組み合わせで問題あり
  // Cloudflare Workers でのビルドエラーを回避するために node-server プリセットを使用
  nitro: {
    preset: "node-server",
  },
});
