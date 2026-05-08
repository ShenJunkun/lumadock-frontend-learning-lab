import { apiRequest } from "./client";
import type { AuthTokenResponse, AuthUser } from "../types/auth";

export function login(payload: { email: string; password: string }) {
  return apiRequest<AuthTokenResponse>("/api/auth/login", {
    body: JSON.stringify(payload),
    method: "POST",
  });
}

export function getMe() {
  return apiRequest<AuthUser>("/api/auth/me");
}
