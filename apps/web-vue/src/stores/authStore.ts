import type { AuthTokenResponse, AuthUser } from "@lumadock/api-client";
import { defineStore } from "pinia";

import { setAuthTokenProvider } from "../api/client";

export const AUTH_STORAGE_KEY = "lumadock.auth";

type StoredSession = {
  token: string;
  user: AuthUser;
};

function readStoredSession(): StoredSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function writeStoredSession(session: StoredSession) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export const useAuthStore = defineStore("auth", {
  state: () => {
    const session = readStoredSession();
    return {
      token: session?.token ?? null,
      user: session?.user ?? null,
    } as {
      token: string | null;
      user: AuthUser | null;
    };
  },
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },
  actions: {
    hydrate() {
      const session = readStoredSession();
      this.token = session?.token ?? null;
      this.user = session?.user ?? null;
    },
    logout() {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      this.token = null;
      this.user = null;
    },
    setSession(response: AuthTokenResponse) {
      const session = {
        token: response.access_token,
        user: response.user,
      };
      writeStoredSession(session);
      this.token = session.token;
      this.user = session.user;
    },
  },
});

export function wireAuthTokenProvider() {
  setAuthTokenProvider(() => useAuthStore().token);
}
