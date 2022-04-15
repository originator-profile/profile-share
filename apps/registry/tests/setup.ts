import { beforeEach, afterEach } from "vitest";
import { stdout, stderr } from "stdout-stderr";
import "esbuild-register";

process.env.NODE_ENV = "test";
process.env.TS_NODE_DEV = "true";

beforeEach(() => {
  stdout.start();
  stderr.start();
});

afterEach(() => {
  stdout.stop();
  stderr.stop();
});
