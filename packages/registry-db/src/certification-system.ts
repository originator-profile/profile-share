import { getClient } from "./lib/prisma-client";
import { CertificationSystem } from "@originator-profile/model";
import { NotFoundError } from "http-errors-enhanced";

export const CertificationSystemRepository = () => ({
  /** 認証制度の取得 */
  async read({ uuid }: { uuid: string }): Promise<CertificationSystem> {
    const prisma = getClient();
    const data = await prisma.certificationSystems.findUnique({
      where: { id: uuid },
      include: {
        certifier: true,
        verifier: true,
      },
    });

    if (!data) throw new NotFoundError("Certification system not found.");

    return {
      type: "certification-system",
      ...data,
    } satisfies CertificationSystem;
  },

  /** すべての認証制度の取得 */
  async all(opts: {
    selfDeclaration: {
      /** 自己宣言用の認証の名称一覧 */
      names: string[];
      verifier: {
        /** 自己宣言用のUUID */
        id: string;
        /** 自己宣言用の組織名 */
        name: string;
      };
    };
  }): Promise<Array<CertificationSystem>> {
    const prisma = getClient();
    const data = await prisma.certificationSystems.findMany({
      include: {
        certifier: true,
        verifier: true,
      },
    });

    const certificationSystems: Array<CertificationSystem & { id: string }> =
      data.map((c) => ({
        type: "certification-system" as const,
        ...c,
      }));

    return certificationSystems.flatMap((c) => {
      if (!opts.selfDeclaration.names.includes(c.name)) return [c];

      return [
        c,
        // 自己宣言
        {
          ...c,
          verifier: opts.selfDeclaration.verifier,
        },
      ];
    });
  },
});

export type CertificationSystemRepository = ReturnType<
  typeof CertificationSystemRepository
>;
