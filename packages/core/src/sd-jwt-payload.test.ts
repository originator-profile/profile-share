import { test, expect } from "vitest";
import { JwtDpPayload, OriginatorProfile } from "@originator-profile/model";
import { isSdJwtOpPayload } from "./sd-jwt-payload";

test("isSdJwtOpPayload() returns true if of type OriginatorProfile", () => {
  const payload: OriginatorProfile = {
    vct: "https://originator-profile.org/orgnization",
    "vct#integrity": "sha256-...",
    iss: "https://example.org",
    "iss#integrity": "sha256-...",
    sub: "example.com",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000 + 3600),
    locale: "ja-JP",
    jwks: {
      keys: [
        // Publicly known test key
        // https://www.rfc-editor.org/rfc/rfc9500.html#section-2.3-2
        {
          kty: "EC",
          x: "QiVI-I-3gv-17KN0RFLHKh5Vj71vc75eSOkyMsxFxbE",
          y: "bEzRDEy41bihcTnpSILImSVymTQl9BQZq36QpCpJQnI",
          crv: "P-256",
          kid: "LIstkoCvByn4jk8oZPvigQkzTzO9UwnGnE-VMlkZvYQ",
        },
      ],
    },
    holder: {
      name: "example name",
      url: "https://example.com/",
      domain_name: "example.com",
      country: "JP",
      corporate_number: "1234567890123",
    },
    issuer: {
      name: "example registry",
      url: "https://example.org/",
      domain_name: "example.org",
      country: "JP",
      corporate_number: "0123456789012",
    },
  };
  expect(isSdJwtOpPayload(payload)).toBe(true);
});

test("isSdJwtOpPayload() returns false if of type JwtDpPayload", () => {
  const payload: JwtDpPayload = {
    iss: "example.com",
    sub: "https://example.com/",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000 + 3600),
    "https://originator-profile.org/dp": {
      item: [],
    },
  };
  expect(isSdJwtOpPayload(payload)).toBe(false);
});
