import { OpHolder, Dp, Jwk } from "@originator-profile/model";
import { signBody } from "@originator-profile/sign";
import addYears from "date-fns/addYears";

/** サンプル Ad Profile Pair (packages/registry-ui/public/examples/{ad,many-dps}.html で使用) */
export default async function exampleAd(
  issuer: OpHolder["domainName"],
  origin: URL["origin"],
  privateKey: Jwk,
): Promise<Dp> {
  const proofJws = await signBody("", privateKey);
  return {
    type: "dp",
    issuer,
    subject: "6a65e608-6b3e-4184-9fd2-0aafd1ddd38e",
    issuedAt: new Date().toISOString(),
    expiredAt: addYears(new Date(), 10).toISOString(),
    item: [
      {
        type: "advertisement",
        title: "Originator Profile",
        description:
          "Originator Profile 技術は、ウェブコンテンツの作成者や広告主などの情報を検証可能な形で付与することで、第三者認証済みの良質な記事やメディアを容易に見分けられるようにする技術です。",
        image: "https://op-logos.demosites.pages.dev/placeholder-120x80.png",
      },
      {
        type: "visibleText",
        location: "#ad-6a65e608-6b3e-4184-9fd2-0aafd1ddd38e",
        proof: { jws: proofJws },
      },
    ],
    allowedOrigins: [origin],
  } satisfies Dp;
}
