import { test, expect } from "vitest";

test("SwaggerUIの提供しているリソースにアクセスできる", async () => {
  const res = await fetch(
    "http://localhost:8080/documentation/static/swagger-ui.css",
  );

  expect(res.ok).toBe(true);
  expect(res.headers.get("content-type")).toBe("text/css; charset=UTF-8");
});
