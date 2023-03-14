import child_process from "node:child_process";
import crypto from "node:crypto";
import path from "node:path";
import util from "node:util";

const exec = util.promisify(child_process.exec);

async function globalSetup() {
  process.env.WORDPRESS_ADMIN_PASSWORD = crypto
    .randomBytes(32)
    .toString("base64url");
  await exec(path.resolve(__dirname, "setup.sh"));

  console.log(
    `WordPress Admin Password: ${process.env.WORDPRESS_ADMIN_PASSWORD}`
  );
}

export default globalSetup;
