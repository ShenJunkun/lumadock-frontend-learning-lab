import type {
  AdminLead,
  AuthTokenResponse,
  AuthUser,
  LeadPayload,
  LeadResponse,
  Stats,
} from "@lumadock/api-client";

import { fallbackProducts } from "../data/fallbackProducts";

export const mockUsers = {
  admin: {
    email: "admin@lumadock.local",
    id: 1,
    name: "LumaDock Admin",
    role: "admin",
  },
  viewer: {
    email: "viewer@lumadock.local",
    id: 2,
    name: "LumaDock Viewer",
    role: "viewer",
  },
} satisfies Record<string, AuthUser>;

export const mockTokens = {
  admin: "admin-token",
  viewer: "viewer-token",
} as const;

export const mockAdminLeads: AdminLead[] = [
  {
    id: 1,
    product_id: "lumadock-studio",
    product_name: "LumaDock Studio",
    name: "Test User",
    email: "test@example.com",
    company: "Demo",
    role: "Learner",
    message: "E2E booking",
    configuration: { finish: "graphite", stand: "floating" },
    created_at: new Date("2026-05-08T09:00:00.000Z").toISOString(),
  },
  {
    id: 2,
    product_id: "lumadock-air",
    product_name: "LumaDock Air",
    name: "Grace Hopper",
    email: "grace@example.com",
    company: "Compiler Labs",
    role: "Engineer",
    message: "Interested in travel desks.",
    configuration: { finish: "pearl", stand: "flat" },
    created_at: new Date("2026-05-09T11:30:00.000Z").toISOString(),
  },
];

export function buildMockStats(leads: AdminLead[] = mockAdminLeads): Stats {
  const averagePrice =
    fallbackProducts.reduce((total, product) => total + product.price, 0) / fallbackProducts.length;
  return {
    average_price: Number(averagePrice.toFixed(2)),
    latest_lead_at: leads[0]?.created_at ?? null,
    leads: leads.length,
    products: fallbackProducts.length,
  };
}

export function buildTokenResponse(user: AuthUser, accessToken: string): AuthTokenResponse {
  return {
    access_token: accessToken,
    token_type: "bearer",
    user,
  };
}

export function buildLeadResponse(payload: LeadPayload, id: number): LeadResponse {
  return {
    company: payload.company ?? null,
    configuration: payload.configuration,
    created_at: new Date().toISOString(),
    email: payload.email,
    id,
    message: payload.message ?? null,
    name: payload.name,
    product_id: payload.product_id ?? null,
    role: payload.role ?? null,
  };
}
