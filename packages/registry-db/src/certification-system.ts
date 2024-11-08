import { CertificationSystem } from "@originator-profile/model";
import { getClient } from "./lib/prisma-client";

export const CertificationSystemRepository = () => ({
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
        type: "CertificationSystem" as const,
        ...c,
      }));

    return certificationSystems.map((c) => {
      if (!opts.selfDeclaration.names.some((n) => c.name.includes(n))) return c;

      /* 自己宣言用に改変 */
      return {
        ...c,
        verifier: opts.selfDeclaration.verifier,
      };
    });
  },
});

export type CertificationSystemRepository = ReturnType<
  typeof CertificationSystemRepository
>;
