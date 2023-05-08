import { test, expect } from "vitest";
import { JwtOpPayload, JwtDpPayload } from "@webdino/profile-model";
import { isJwtOpPayload, isJwtDpPayload } from "./jwt-payload";

test("isJwtOpPayload() returns true if of type JwtOpPayload", () => {
  const payload: JwtOpPayload = {
    iss: "example.org",
    sub: "example.com",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000 + 3600),
    "https://originator-profile.org/op": {
      item: [],
    },
  };
  expect(isJwtOpPayload(payload)).toBe(true);
});

test("isJwtOpPayload() returns false if of type JwtDpPayload", () => {
  const payload: JwtDpPayload = {
    iss: "example.com",
    sub: "https://example.com/",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000 + 3600),
    "https://originator-profile.org/dp": {
      item: [],
    },
  };
  expect(isJwtOpPayload(payload)).toBe(false);
});

test("isJwtDpPayload() returns true if of type JwtDpPayload", () => {
  const payload: JwtDpPayload = {
    iss: "example.com",
    sub: "https://example.com/",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000 + 3600),
    "https://originator-profile.org/dp": {
      item: [],
    },
  };
  expect(isJwtDpPayload(payload)).toBe(true);
});
