interface ImportMeta {
  env: {
    MODE: "development" | "production";
    PROFILE_ISSUER: string;
    PROFILE_REGISTRY_URL: string;
    BASIC_AUTH: boolean;
    BASIC_AUTH_CREDENTIALS: {
      domain: string;
      username: string;
      password: string;
    }[];
    REGISTRY_OPS: {
      core: string;
      annotations?: string[];
      media?: string;
    }[];
  };
}
