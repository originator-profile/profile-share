import findHtmlFiles from "../../utils/findHTMLFiles";

const origin = "https://originator-profile.org";

export default defineEventHandler(async (event) => {
  // runtimeConfigから環境変数を取得
  const config = useRuntimeConfig(event);
  const WEBROOT_PATH = config.WEBROOT_PATH;
  const VC_OUTPUT_PATH = config.VC_OUTPUT_PATH;

  if (!WEBROOT_PATH || !VC_OUTPUT_PATH) {
    throw createError({
      statusCode: 500,
      message: "必要な環境変数が設定されていません",
    });
  }

  const docsPath = WEBROOT_PATH.endsWith("/")
    ? WEBROOT_PATH
    : `${WEBROOT_PATH}/`;

  const htmlFiles = await findHtmlFiles({
    docsPath,
    origin,
    vcSourcesPath: VC_OUTPUT_PATH,
  });
  console.log(htmlFiles.length + "件のHTMLファイルが見つかりました");

  return htmlFiles;
});
