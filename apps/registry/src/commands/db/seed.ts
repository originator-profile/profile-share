import { Command } from "@oclif/core";
import { seed } from "../../seed";

export class DbSeed extends Command {
  static description = "Seed database";

  async run(): Promise<void> {
    await seed();
  }
}
