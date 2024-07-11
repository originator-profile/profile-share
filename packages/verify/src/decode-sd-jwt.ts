import { decodeJwt } from "jose";

/**
 * SD-JWT のデコード
 * @param sdJwt SD-JWT
 * @return SD-JWT の JWT のペイロード
 * **/
export function decodeSdJwt(sdJwt: string) {
  const jwt = sdJwt.split("~")[0];
  return decodeJwt(jwt);
}
