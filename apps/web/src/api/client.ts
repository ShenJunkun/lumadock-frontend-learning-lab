import { ApiError, createLumadockApiClient } from "@lumadock/api-client";

function readApiBaseUrl() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!apiBaseUrl) {
    throw new Error("VITE_API_BASE_URL is required. Copy apps/web/.env.example first.");
  }
  return apiBaseUrl.replace(/\/$/, "");
}

export const API_BASE_URL = readApiBaseUrl();

let authTokenProvider: () => string | null = () => null;

export function setAuthTokenProvider(provider: () => string | null) {
  authTokenProvider = provider;
}

export const lumadockApiClient = createLumadockApiClient({
  baseUrl: API_BASE_URL,
  getAuthToken: () => authTokenProvider(),
});

export { ApiError };
