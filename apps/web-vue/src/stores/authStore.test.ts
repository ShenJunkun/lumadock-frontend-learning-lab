import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import { AUTH_STORAGE_KEY, useAuthStore } from "./authStore";

describe("authStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    window.localStorage.clear();
  });

  it("stores and clears a session", () => {
    const store = useAuthStore();
    store.setSession({
      access_token: "token",
      token_type: "bearer",
      user: {
        email: "admin@lumadock.local",
        id: 1,
        name: "Admin",
        role: "admin",
      },
    });

    expect(store.isAuthenticated).toBe(true);
    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toContain("token");

    store.logout();
    expect(store.isAuthenticated).toBe(false);
    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });
});
