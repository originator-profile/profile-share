import {
  createRemoteJWKSet as RemoteKeys,
  createLocalJWKSet as LocalKeys,
} from "jose";

export type Keys = ReturnType<typeof RemoteKeys> | ReturnType<typeof LocalKeys>;

export { RemoteKeys, LocalKeys };
