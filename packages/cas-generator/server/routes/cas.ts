import { exec } from "child_process";
import fs from "fs";
import { createEventStream } from "h3";
import postHTMLFiles from "../utils/postHTMLFiles";
import {
  origin,
  arrowedURLOrigins,
  opcipName,
  ogpImageURL,
} from "../constants";
import { OpSiteInfo } from "../domain/originatorProfileSite";

/**
 * 指定したファイルに対して、profile-registry ca:sign を実行する
 * @param path
 * @returns Promise<string>
 */
const execute = (path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(
      `profile-registry ca:sign -i ${process.env.PRIVATE_KEY_PATH} --input ${path}`,
      { timeout: 10000 },
      (err, stdout, stderr) => {
        if (err) {
          console.log(stderr);

          reject(err);
        }
        resolve(stdout);
      },
    );
  });
};

/**
 * 指定したファイルを削除する
 * @param casPath
 * @param htmlFiles
 * @returns Promise<string>
 */
const deleteSpecificFiles = (
  casPath: string,
  htmlFiles: OpSiteInfo[],
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const filesToDelete = htmlFiles.map(
      (item) => `${casPath}${item.cas}.cas.json`,
    );
    const deleteCommands = filesToDelete
      .map((file) => `rm -f "${file}"`)
      .join(" && ");

    if (filesToDelete.length === 0) {
      resolve("");
      return;
    }

    exec(deleteCommands, { timeout: 10000 }, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      }
      resolve(stdout);
    });
  });
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const WEBROOT_PATH = config.WEBROOT_PATH;
  const VC_OUTPUT_PATH = config.VC_OUTPUT_PATH;
  const CAS_OUTPUT_PATH = config.CAS_OUTPUT_PATH;
  if (!WEBROOT_PATH || !VC_OUTPUT_PATH || !CAS_OUTPUT_PATH) {
    throw createError({
      statusCode: 500,
      message: "必要な環境変数が設定されていません",
    });
  }

  const htmlFiles = await readBody(event);
  const eventStream = createEventStream(event);
  const vcSourcesPath = VC_OUTPUT_PATH;
  const casPath = CAS_OUTPUT_PATH;

  // see https://nitro.build/guide/websocket#server-sent-events-sse
  await deleteSpecificFiles(casPath, htmlFiles);

  await postHTMLFiles({
    htmlFiles,
    docsPath: WEBROOT_PATH,
    origin: origin,
    vcSourcesPath: vcSourcesPath,
    arrowedURLOrigins: arrowedURLOrigins,
    opcipName: opcipName,
    ogpImageURL: ogpImageURL,
  });

  (async () => {
    for (let i = 0; i < htmlFiles.length; i++) {
      const item = htmlFiles[i];
      console.log("vc_path", item.vc_path);

      try {
        const stdout = await execute(item.vc_path);
        // casPath にファイルを保存する
        const outputCasFile = [stdout.toString().trim()];
        fs.writeFileSync(
          `${casPath}${item.cas}.cas.json`,
          JSON.stringify(outputCasFile, null, 2),
        );
        const outputCasData = JSON.stringify({
          ...item,
          vc: item.vc,
        });
        await eventStream.push(outputCasData);
      } catch (error) {
        console.log(error);
        await eventStream.push(JSON.stringify({ ...item, error }));
      }
    }
  })();
  eventStream.onClosed(async () => {
    console.log("closing SSE...");
    await eventStream.close();
  });

  return eventStream.send();
});
