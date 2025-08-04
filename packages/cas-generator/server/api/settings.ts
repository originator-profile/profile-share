export default defineEventHandler(async () => {
  return {
    WEBROOT_PATH: process.env.WEBROOT_PATH,
    VC_OUTPUT_PATH: process.env.VC_OUTPUT_PATH,
    CAS_OUTPUT_PATH: process.env.CAS_OUTPUT_PATH,
    PRIVATE_KEY_PATH: process.env.PRIVATE_KEY_PATH,
    ISSUER: process.env.ISSUER,
    AUTHORIZATION_ENDPOINT: process.env.AUTHORIZATION_ENDPOINT,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    REDIRECT_URI: process.env.REDIRECT_URI
  };
});
