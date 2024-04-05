import { Prisma, categories } from "@prisma/client";
import { NotFoundError } from "http-errors-enhanced";
import { getClient } from "@originator-profile/registry-db";

export const CategoryService = () => ({
  /**
   * カテゴリーの作成
   * @param input カテゴリー
   * @return カテゴリー
   */
  async create(input: Prisma.categoriesCreateInput): Promise<categories> {
    const prisma = getClient();
    return await prisma.categories.create({ data: input });
  },
  /**
   * 複数のカテゴリーの作成
   * @param input カテゴリーまたはその配列
   * @return 作成数
   */
  async createMany(
    input: Prisma.Enumerable<Prisma.categoriesCreateManyInput>,
  ): Promise<Prisma.BatchPayload> {
    const prisma = getClient();
    return await prisma.categories.createMany({
      data: input,
      skipDuplicates: true,
    });
  },
  /**
   * カテゴリーの表示
   * @param cat カテゴリーコードまたはID
   * @param cattax 使用タクソノミー https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/master/AdCOM%20v1.0%20FINAL.md#list_categorytaxonomies
   * @throws {NotFoundError} カテゴリーが見つからない
   * @return カテゴリー
   */
  async read({
    cat,
    cattax,
  }: {
    cat: string;
    cattax: number;
  }): Promise<categories> {
    const prisma = getClient();
    const data = await prisma.categories.findUnique({
      where: { cat_cattax: { cat, cattax } },
    });

    if (!data) {
      throw new NotFoundError("Category not found.");
    }

    return data;
  },
  /**
   * カテゴリーの更新
   * @param input カテゴリー
   * @return カテゴリー
   */
  async update(
    input: Prisma.categoriesUpdateInput & { cat: string; cattax: number },
  ): Promise<categories> {
    const prisma = getClient();
    return await prisma.categories.update({
      where: { cat_cattax: { cat: input.cat, cattax: input.cattax } },
      data: input,
    });
  },
  /**
   * カテゴリーの削除
   * @param cat カテゴリーコードまたはID
   * @param cattax 使用タクソノミー https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/master/AdCOM%20v1.0%20FINAL.md#list_categorytaxonomies
   * @return ウェブページ
   */
  async delete({
    cat,
    cattax,
  }: {
    cat: string;
    cattax: number;
  }): Promise<categories> {
    const prisma = getClient();
    return await prisma.categories.delete({
      where: { cat_cattax: { cat, cattax } },
    });
  },
});

export type CategoryService = ReturnType<typeof CategoryService>;
