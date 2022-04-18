import OpItem from "@webdino/profile-model/src/op-item";
import Jwks from "@webdino/profile-model/src/jwks";

/** OP JWT Claims Set object */
export type OpPayload = {
  "https://opr.webdino.org/jwt/claims/op": {
    item: OpItem[];
    jwks?: Jwks;
  };
};
