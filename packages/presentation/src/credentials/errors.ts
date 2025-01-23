export class CredentialsFetchFailed extends Error {
  static get code() {
    return "ERR_CREDENTIALS_FETCH_FAILED" as const;
  }
  readonly code = CredentialsFetchFailed.code;
}
