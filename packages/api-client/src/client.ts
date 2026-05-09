import {
  AdminLeadsSchema,
  AuthUserSchema,
  LeadResponseSchema,
  ProductSchema,
  ProductsSchema,
  StatsSchema,
  TokenResponseSchema,
} from "./contracts";
import type {
  AdminLead,
  AuthTokenResponse,
  AuthUser,
  LeadPayload,
  LeadResponse,
  Product,
  Stats,
} from "./types";

export type AuthTokenProvider = () => string | null;

export type LumadockApiClientOptions = {
  baseUrl: string;
  fetchFn?: typeof fetch;
  getAuthToken?: AuthTokenProvider;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function normalizeBaseUrl(baseUrl: string) {
  const normalized = baseUrl.trim().replace(/\/$/, "");
  if (!normalized) {
    throw new Error("A non-empty API base URL is required.");
  }
  return normalized;
}

export function createLumadockApiClient({
  baseUrl,
  fetchFn,
  getAuthToken = () => null,
}: LumadockApiClientOptions) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);

  async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
    const token = getAuthToken();
    const response = await (fetchFn ?? fetch)(`${normalizedBaseUrl}${path}`, {
      ...init,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });

    if (!response.ok) {
      let message = `Request failed with ${response.status}`;
      try {
        const body = (await response.json()) as { detail?: string };
        message = body.detail ?? message;
      } catch {
        // A plain HTTP error body is fine; keep the status-based message.
      }
      throw new ApiError(message, response.status);
    }

    return (await response.json()) as T;
  }

  return {
    getAdminLeads: async (): Promise<AdminLead[]> =>
      AdminLeadsSchema.parse(await apiRequest<unknown>("/api/admin/leads")),
    getMe: async (): Promise<AuthUser> =>
      AuthUserSchema.parse(await apiRequest<unknown>("/api/auth/me")),
    getProduct: async (productId: string): Promise<Product> =>
      ProductSchema.parse(await apiRequest<unknown>(`/api/products/${productId}`)),
    getProducts: async (): Promise<Product[]> =>
      ProductsSchema.parse(await apiRequest<unknown>("/api/products")),
    getStats: async (): Promise<Stats> =>
      StatsSchema.parse(await apiRequest<unknown>("/api/stats")),
    login: async (payload: { email: string; password: string }): Promise<AuthTokenResponse> =>
      TokenResponseSchema.parse(
        await apiRequest<unknown>("/api/auth/login", {
          body: JSON.stringify(payload),
          method: "POST",
        }),
      ),
    submitLead: async (payload: LeadPayload): Promise<LeadResponse> =>
      LeadResponseSchema.parse(
        await apiRequest<unknown>("/api/leads", {
          body: JSON.stringify(payload),
          method: "POST",
        }),
      ),
  };
}

export type LumadockApiClient = ReturnType<typeof createLumadockApiClient>;
