export class ProfileGenericError extends Error {
  static get code() {
    return "ERR_PROFILE_GENERIC";
  }
  readonly code = ProfileGenericError.code;
}

export class ProfilesFetchFailed extends ProfileGenericError {
  static get code() {
    return "ERR_PROFILES_FETCH_FAILED" as const;
  }
  readonly code = ProfilesFetchFailed.code;
}
