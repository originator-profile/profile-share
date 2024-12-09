/**
 * CA ID の解析
 * @param uuid UUID 文字列表現 (RFC 9562)
 * @return UUID 文字列表現
 */
export function parseCaId(uuid: string): string {
  return uuid.toLowerCase().replace(/^urn:uuid:/, "");
}
