import { OpHolder, Dp, Jwk } from "@originator-profile/model";
import { signBody } from "@originator-profile/sign";
import addYears from "date-fns/addYears";

/** サンプル Ad Profile Pair (packages/registry-ui/public/examples/ad.html で使用) */
export default async function exampleAd2(
  issuer: OpHolder["domainName"],
  origin: URL["origin"],
  privateKey: Jwk,
): Promise<Dp> {
  const proofJws = await signBody(
    '<img src="http://localhost:8081/ad-image-2.png">',
    privateKey,
  );
  return {
    type: "dp",
    issuer,
    subject: "c920e93a-7f46-4d4e-a080-7aafb23be7ee",
    issuedAt: new Date().toISOString(),
    expiredAt: addYears(new Date(), 10).toISOString(),
    item: [
      {
        type: "advertisement",
        title: "iframe 2",
        image: "http://localhost:8081",
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
