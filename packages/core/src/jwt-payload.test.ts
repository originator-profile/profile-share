import { test, expect } from "vitest";
import JwtOpPayload from "@webdino/profile-model/src/jwt-op-payload";
import JwtDpPayload from "@webdino/profile-model/src/jwt-dp-payload";
import { isJwtOpPayload, isJwtDpPayload } from "./jwt-payload";

test("isJwtOpPayload() returns true if of type JwtOpPayload", () => {
  const payload: JwtOpPayload = {
    iss: "http://iss.example",
    sub: "http://sub.example",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000 + 3600),
    "https://opr.webdino.org/jwt/claims/op": {
      item: [],
    },
  };
  expect(isJwtOpPayload(payload)).toBe(true);
});

test("isJwtOpPayload() returns false if of type JwtDpPayload", () => {
  const payload: JwtDpPayload = {
    iss: "http://iss.example",
    sub: "http://sub.example",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000 + 3600),
    "https://opr.webdino.org/jwt/claims/dp": {
      item: [],
    },
  };
  expect(isJwtOpPayload(payload)).toBe(false);
});

test("isJwtDpPayload() returns true if of type JwtDpPayload", () => {
  const payload: JwtDpPayload = {
    iss: "http://iss.example",
    sub: "http://sub.example",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000 + 3600),
    "https://opr.webdino.org/jwt/claims/dp": {
      item: [],
    },
  };
  expect(isJwtDpPayload(payload)).toBe(true);
});
