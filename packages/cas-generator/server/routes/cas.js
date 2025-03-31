import { exec } from "child_process";
import fs from "fs";
import { createEventStream } from "h3";

const casPath = process.env.CAS_OUTPUT_PATH;

const execute = (path) => {
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

const emptyDir = (casPath) => {
  return new Promise((resolve, reject) => {
    exec(`rm -rf ${casPath}*`, { timeout: 10000 }, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      }
      resolve(stdout);
    });
  });
};

export default defineEventHandler(async (event) => {
  const htmlFiles = await readBody(event);
  const eventStream = createEventStream(event);
  // see https://nitro.build/guide/websocket#server-sent-events-sse
  // ファイル生成場所内を空っぽにする
  await emptyDir(casPath);

  (async () => {
    for (let i = 0; i < htmlFiles.length; i++) {
      const item = htmlFiles[i];
      console.log(item.vc_path);

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
