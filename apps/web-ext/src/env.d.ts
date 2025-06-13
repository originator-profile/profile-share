interface ImportMeta {
  env: {
    MODE: "development" | "production";
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
