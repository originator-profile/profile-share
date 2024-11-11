export class SiteProfileFetchFailed extends Error {
  static get code() {
    return "ERR_SITE_PROFILE_FETCH_FAILED" as const;
  }
  readonly code = SiteProfileFetchFailed.code;
  readonly ok = false;

  /** 取得結果 */
  result: {
    error?: Error;
    payload?: unknown;
  };

  constructor(message: string, result: SiteProfileFetchFailed["result"]) {
    super(message);
    this.result = result;
  }
}

export class SiteProfileFetchInvalid extends Error {
  static get code() {
    return "ERR_SITE_PROFILE_FETCH_INVALID" as const;
  }
  readonly code = SiteProfileFetchInvalid.code;
  readonly ok = false;

  /** バリデーション結果 */
  result: {
    error?: Error;
    payload?: unknown;
  };

  constructor(message: string, result: SiteProfileFetchInvalid["result"]) {
    super(message);
    this.result = result;
  }
}
