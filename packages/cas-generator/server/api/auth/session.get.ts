const decodeJwtPayload = (token: string) => {
  const parts = token.split(".");
  if (parts.length < 2) {
    throw new Error("Invalid JWT");
  }

  const base64 = parts[1]
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(parts[1].length + ((4 - (parts[1].length % 4)) % 4), "=");

  const decoded = Buffer.from(base64, "base64").toString("utf-8");
  return JSON.parse(decoded) as Record<string, unknown>;
};

export default defineEventHandler((event) => {
  const idToken = getCookie(event, "id_token");

  if (!idToken) {
    return {
      isLoggedIn: false,
      email: null,
    };
  }

  try {
    const payload = decodeJwtPayload(idToken);
    const email = typeof payload.email === "string" ? payload.email : null;

    return {
      isLoggedIn: true,
      email,
    };
  } catch (error) {
    console.warn("Failed to decode id_token", error);
    return {
      isLoggedIn: false,
      email: null,
    };
  }
});
