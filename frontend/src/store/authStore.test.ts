import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { AUTH_STORAGE_KEY, useAuthStore } from "./authStore";

const adminSession = {
  access_token: "demo-token",
  token_type: "bearer" as const,
  user: {
    email: "admin@lumadock.local",
    id: 1,
    name: "LumaDock Admin",
    role: "admin" as const,
  },
};

describe("auth store", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useAuthStore.setState({ isAuthenticated: false, token: null, user: null });
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("persists a logged-in session", () => {
    useAuthStore.getState().setSession(adminSession);

    expect(useAuthStore.getState().token).toBe("demo-token");
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toContain("demo-token");
  });

  it("hydrates and clears the stored session", () => {
    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ token: "stored-token", user: adminSession.user }),
    );

    useAuthStore.getState().hydrate();
    expect(useAuthStore.getState().token).toBe("stored-token");

    useAuthStore.getState().logout();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });
});
