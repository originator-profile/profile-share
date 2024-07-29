import { decodeJwt } from "jose";

/**
 * SD-JWT のデコード
 * @param sdJwt SD-JWT
 * @return SD-JWT の JWT のペイロード
 * **/
export function decodeSdJwt(sdJwt: string): ReturnType<typeof decodeJwt> {
  const [issuerJwt] = sdJwt.split("~");
  return decodeJwt(issuerJwt);
}
