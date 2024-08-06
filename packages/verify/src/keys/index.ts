import {
  createRemoteJWKSet as RemoteKeys,
  createLocalJWKSet as LocalKeys,
} from "jose";
export * from "./jwt-vc-issuer";

export type Keys = ReturnType<typeof RemoteKeys> | ReturnType<typeof LocalKeys>;

export { RemoteKeys, LocalKeys };
