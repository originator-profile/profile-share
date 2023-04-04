import child_process from "node:child_process";
import crypto from "node:crypto";
import path from "node:path";
import util from "node:util";

const exec = util.promisify(child_process.exec);

async function globalSetup() {
  process.env.WORDPRESS_ADMIN_USER = `profile-tester-${crypto.randomInt(
    65535
  )}`;
  process.env.WORDPRESS_ADMIN_PASSWORD = crypto
    .randomBytes(32)
    .toString("base64url");
  await exec(path.resolve(__dirname, "docker-setup.sh"));
}

export default globalSetup;
