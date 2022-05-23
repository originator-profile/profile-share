import OpItem from "@webdino/profile-model/src/op-item";
import Jwks from "@webdino/profile-model/src/jwks";
import DpItem from "@webdino/profile-model/src/dp-item";

/** OP JWT Claims Set object */
export type OpPayload = {
  "https://opr.webdino.org/jwt/claims/op": {
    item: OpItem[];
    jwks?: Jwks;
  };
};

/** DP JWT Claims Set object */
export type DpPayload = {
  "https://opr.webdino.org/jwt/claims/dp": {
    item: DpItem[];
  };
};
