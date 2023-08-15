import { admins } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getClient } from "@originator-profile/registry-db";

type AccountId = string;

export const AdminService = () => ({
  /**
   * 管理者の認証
   * @param id 管理者 ID
   * @param password パスフレーズ
   */
  async auth(id: AccountId, password: string): Promise<boolean> {
    const prisma = getClient();
    const data = await prisma.admins
      .findUniqueOrThrow({ where: { adminId: id } })
      .catch((e: Error) => e);
    if (data instanceof Error) return false;
    return await bcrypt.compare(password, data.password);
  },
  /**
   * 管理者の作成
   * @param id 会員 ID
   * @param password パスフレーズ
   */ async create(id: AccountId, password: string): Promise<admins | Error> {
    const prisma = getClient();
    const hashedPassword = await bcrypt.hash(password, 12);
    return await prisma.admins
      .create({
        data: {
          adminId: id,
          password: hashedPassword,
        },
      })
      .catch((e: Error) => e);
  },
  /**
   * 管理者権限の削除
   * @param id 管理者 ID
   */
  async delete(id: AccountId): Promise<admins | Error> {
    const prisma = getClient();
    return await prisma.admins
      .delete({ where: { adminId: id } })
      .catch((e: Error) => e);
  },
});

export type AdminService = ReturnType<typeof AdminService>;
