export class SiteProfileFetchFailed extends Error {
  static get code() {
    return "ERR_WEBSITE_METADATA_FETCH_FAILED" as const;
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

export class SiteProfileInvalid extends Error {
  static get code() {
    return "ERR_WEBSITE_METADATA_INVALID" as const;
  }
  readonly code = SiteProfileInvalid.code;
  readonly ok = false;

  /** バリデーション結果 */
  result: {
    error?: Error;
    payload?: unknown;
  };

  constructor(message: string, result: SiteProfileInvalid["result"]) {
    super(message);
    this.result = result;
  }
}
