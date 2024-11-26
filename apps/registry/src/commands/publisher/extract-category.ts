import { Prisma } from "@prisma/client";
import { Args, Command, Flags } from "@oclif/core";
import { readFile, utils } from "xlsx";
import fs from "node:fs/promises";

export class PublisherExtractCategory extends Command {
  static description =
    'カテゴリー情報の抽出 ("publisher:category -o createMany"用)';
  static args = {
    output: Args.string({
      description: `出力先ファイル ("-": 標準出力)`,
      default: "category.json",
    }),
  };
  static flags = {
    input: Flags.string({
      summary: "Excel file",
      description: `\
IAB Tech Lab Content Category Taxonomy 1.0の定義ファイル
詳しくは当該ファイル https://iabtechlab.com/wp-content/uploads/2023/03/Content-Taxonomy-1.0-1.xlsx を参照してください`,
      required: true,
    }),
    header: Flags.integer({
      summary: "Header position",
      description: "Excelファイル中のヘッダーの行番号",
      default: 2,
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(PublisherExtractCategory);
    const input: string = flags.input;
    const output: string = args.output;
    const range: number = flags.header - 1;
    const workbook = readFile(input);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const fromJson: { "IAB Code": string; "IAB Category": string }[] =
      utils.sheet_to_json(worksheet, { range: range });

    const toJson = fromJson.map<Prisma.categoriesCreateManyInput>((e) => ({
      cat: e["IAB Code"],
      name: e["IAB Category"],
      cattax: 1,
    }));
    if (output === "-") {
      this.log(JSON.stringify(toJson, null, 2));
      return;
    }
    await fs.writeFile(output, JSON.stringify(toJson, null, 2));
  }
}
