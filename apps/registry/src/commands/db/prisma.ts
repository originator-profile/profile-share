import { Command } from "@oclif/core";
import { spawn } from "node:child_process";

export class DbPrisma extends Command {
  static description = `Prisma CLI
see: https://www.prisma.io/docs/reference/api-reference/command-reference`;

  async run(): Promise<void> {
    const proc = spawn("npx", ["prisma", ...this.argv]);
    let err = "";
    proc.stderr.on("data", (data: Buffer) => (err += data.toString()));
    proc.stdout.on("data", (data: Buffer) => this.log(data.toString()));

    const exit: number = await new Promise((resolve) => {
      proc.once("close", resolve);
    });

    if (exit !== 0) this.error(err, { exit });
  }
}
