import { PrismaClient, Prisma, categories } from "@prisma/client";
import { NotFoundError } from "http-errors-enhanced";

type Options = {
  prisma: PrismaClient;
};

export const CategoryService = ({ prisma }: Options) => ({
  /**
   * カテゴリーの作成
   * @param input カテゴリー
   * @return カテゴリー
   */
  async create(
    input: Prisma.categoriesCreateInput,
  ): Promise<categories | Error> {
    return await prisma.categories
      .create({ data: input })
      .catch((e: Error) => e);
  },
  /**
   * 複数のカテゴリーの作成
   * @param input カテゴリーまたはその配列
   * @return 作成数
   */
  async createMany(
    input: Prisma.Enumerable<Prisma.categoriesCreateManyInput>,
  ): Promise<Prisma.BatchPayload | Error> {
    return await prisma.categories
      .createMany({
        data: input,
        skipDuplicates: true,
      })
      .catch((e: Error) => e);
  },
  /**
   * カテゴリーの表示
   * @param cat カテゴリーコードまたはID
   * @param cattax 使用タクソノミー https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/master/AdCOM%20v1.0%20FINAL.md#list_categorytaxonomies
   * @return カテゴリー
   */
  async read({
    cat,
    cattax,
  }: {
    cat: string;
    cattax: number;
  }): Promise<categories | Error> {
    const data = await prisma.categories
      .findUnique({ where: { cat_cattax: { cat, cattax } } })
      .catch((e: Error) => e);
    return data ?? new NotFoundError();
  },
  /**
   * カテゴリーの更新
   * @param input カテゴリー
   * @return カテゴリー
   */
  async update(
    input: Prisma.categoriesUpdateInput & { cat: string; cattax: number },
  ): Promise<categories | Error> {
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
  }): Promise<categories | Error> {
    return await prisma.categories.delete({
      where: { cat_cattax: { cat, cattax } },
    });
  },
});

export type CategoryService = ReturnType<typeof CategoryService>;
