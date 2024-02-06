import { OpHolder, Dp, Jwk } from "@originator-profile/model";
import { signBody } from "@originator-profile/sign";
import addYears from "date-fns/addYears";

/** サンプル Ad Profile Pair (packages/registry-ui/public/examples/ad.html で使用) */
export default async function exampleAd3(
  issuer: OpHolder["domainName"],
  origin: URL["origin"],
  privateKey: Jwk,
): Promise<Dp> {
  const proofJws = await signBody(
    '<img src="http://localhost:8081/ad-image-3.png">',
    privateKey,
  );
  return {
    type: "dp",
    issuer,
    subject: "f2133430-5329-4b64-8a93-b3ef761a825c",
    issuedAt: new Date().toISOString(),
    expiredAt: addYears(new Date(), 10).toISOString(),
    item: [
      {
        type: "advertisement",
        title: "iframe 3",
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
