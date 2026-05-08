import { http, HttpResponse } from "msw";

import {
  buildLeadResponse,
  buildMockStats,
  buildTokenResponse,
  mockAdminLeads,
  mockTokens,
  mockUsers,
} from "./fixtures";
import { fallbackProducts } from "../data/fallbackProducts";
import type { LeadPayload } from "../types/product";

let leads = [...mockAdminLeads];

function getUserFromAuthorization(request: Request) {
  const authorization = request.headers.get("authorization");
  if (authorization === `Bearer ${mockTokens.admin}`) {
    return mockUsers.admin;
  }
  if (authorization === `Bearer ${mockTokens.viewer}`) {
    return mockUsers.viewer;
  }
  return null;
}

export function resetMockData() {
  leads = [...mockAdminLeads];
}

export const handlers = [
  http.get("*/api/products", () => HttpResponse.json(fallbackProducts)),

  http.get("*/api/products/:productId", ({ params }) => {
    const product = fallbackProducts.find((item) => item.id === params.productId);
    if (!product) {
      return HttpResponse.json({ detail: "Product not found" }, { status: 404 });
    }
    return HttpResponse.json(product);
  }),

  http.get("*/api/stats", () => HttpResponse.json(buildMockStats(leads))),

  http.post("*/api/leads", async ({ request }) => {
    const payload = (await request.json()) as LeadPayload;
    const product = payload.product_id
      ? fallbackProducts.find((item) => item.id === payload.product_id)
      : null;
    const response = buildLeadResponse(payload, leads.length + 1);
    leads = [
      {
        ...response,
        product_name: product?.name ?? null,
      },
      ...leads,
    ];
    return HttpResponse.json(response, { status: 201 });
  }),

  http.post("*/api/auth/login", async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    if (body.email === "admin@lumadock.local" && body.password === "admin123") {
      return HttpResponse.json(buildTokenResponse(mockUsers.admin, mockTokens.admin));
    }
    if (body.email === "viewer@lumadock.local" && body.password === "viewer123") {
      return HttpResponse.json(buildTokenResponse(mockUsers.viewer, mockTokens.viewer));
    }
    return HttpResponse.json({ detail: "Invalid email or password" }, { status: 401 });
  }),

  http.get("*/api/auth/me", ({ request }) => {
    const user = getUserFromAuthorization(request);
    if (!user) {
      return HttpResponse.json({ detail: "Not authenticated" }, { status: 401 });
    }
    return HttpResponse.json(user);
  }),

  http.get("*/api/admin/leads", ({ request }) => {
    const user = getUserFromAuthorization(request);
    if (!user) {
      return HttpResponse.json({ detail: "Not authenticated" }, { status: 401 });
    }
    if (user.role !== "admin") {
      return HttpResponse.json({ detail: "Insufficient permissions" }, { status: 403 });
    }
    return HttpResponse.json(leads);
  }),
];
