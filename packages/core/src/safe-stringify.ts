export function stringifyWithError(data: unknown): string {
  return data instanceof Error
    ? JSON.stringify(data, Object.getOwnPropertyNames(data))
    : JSON.stringify(data);
}
