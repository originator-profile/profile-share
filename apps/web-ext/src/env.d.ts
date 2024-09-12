interface ImportMeta {
  env: {
    MODE: "development" | "production";
    PROFILE_ISSUER: string;
    BASIC_AUTH: boolean;
    BASIC_AUTH_CREDENTIALS: {
      domain: string;
      username: string;
      password: string;
    }[];
  };
}
