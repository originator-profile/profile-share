import { OpHolder, Dp, Jwk } from "@originator-profile/model";
import { signBody } from "@originator-profile/sign";
import { addYears } from "date-fns/addYears";

/** サンプル Ad Profile Pair (packages/registry-ui/public/examples/ad.html で使用) */
export default async function exampleAd1(
  issuer: OpHolder["domainName"],
  origin: URL["origin"],
  privateKey: Jwk,
): Promise<Dp> {
  const proofJws = await signBody(
    '<img src="http://localhost:8081/ad-image-1.jpg" width="300" height="225">',
    privateKey,
  );
  return {
    type: "dp",
    issuer,
    subject: "2cbb9f82-64fa-43bb-a6b8-acc74cf73c97",
    issuedAt: new Date().toISOString(),
    expiredAt: addYears(new Date(), 10).toISOString(),
    item: [
      {
        type: "advertisement",
        title: "iframe 1",
        image: "http://localhost:8081/ad-image-1.jpg",
      },
      {
        type: "html",
        location: "img",
        proof: { jws: proofJws },
      },
    ],
    allowedOrigins: [origin],
  } satisfies Dp;
}
