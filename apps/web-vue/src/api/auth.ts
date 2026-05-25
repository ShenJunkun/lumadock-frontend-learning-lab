import type { AuthTokenResponse, AuthUser } from "@lumadock/api-client";

import { lumadockApiClient } from "./client";

export async function login(payload: {
  email: string;
  password: string;
}): Promise<AuthTokenResponse> {
  return lumadockApiClient.login(payload);
}

export async function getMe(): Promise<AuthUser> {
  return lumadockApiClient.getMe();
}
