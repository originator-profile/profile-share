export class WebsiteMetadataFetchFailed extends Error {
  static get code() {
    return "ERR_WEBSITE_METADATA_FETCH_FAILED" as const;
  }
  readonly code = WebsiteMetadataFetchFailed.code;
  readonly ok = false;

  /** 取得結果 */
  result: {
    error?: Error;
    payload?: unknown;
  };

  constructor(message: string, result: WebsiteMetadataFetchFailed["result"]) {
    super(message);
    this.result = result;
  }
}

export class WebsiteMetadataInvalid extends Error {
  static get code() {
    return "ERR_WEBSITE_METADATA_INVALID" as const;
  }
  readonly code = WebsiteMetadataInvalid.code;
  readonly ok = false;

  /** バリデーション結果 */
  result: {
    error?: Error;
    payload?: unknown;
  };

  constructor(message: string, result: WebsiteMetadataInvalid["result"]) {
    super(message);
    this.result = result;
  }
}
