import { contentSecurityPolicy, getSecurityHeader, securityHeaders } from "./securityPolicy";

describe("securityPolicy", () => {
  it("documents a restrictive CSP learning baseline", () => {
    expect(contentSecurityPolicy).toContain("default-src 'self'");
    expect(contentSecurityPolicy).toContain("object-src 'none'");
    expect(contentSecurityPolicy).toContain("frame-ancestors 'none'");
  });

  it("exposes security headers by case-insensitive key", () => {
    expect(securityHeaders.map((header) => header.key)).toEqual([
      "Content-Security-Policy",
      "Referrer-Policy",
      "X-Content-Type-Options",
    ]);
    expect(getSecurityHeader("referrer-policy")).toEqual({
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
    });
  });
});
