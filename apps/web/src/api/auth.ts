import { apiRequest } from "./client";
import { AuthUserSchema, TokenResponseSchema } from "./contracts";
import type { AuthTokenResponse, AuthUser } from "../types/auth";

export async function login(payload: {
  email: string;
  password: string;
}): Promise<AuthTokenResponse> {
  return TokenResponseSchema.parse(
    await apiRequest<unknown>("/api/auth/login", {
      body: JSON.stringify(payload),
      method: "POST",
    }),
  );
}

export async function getMe(): Promise<AuthUser> {
  return AuthUserSchema.parse(await apiRequest<unknown>("/api/auth/me"));
}
