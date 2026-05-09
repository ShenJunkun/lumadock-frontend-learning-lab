import type { AuthTokenResponse, AuthUser } from "@lumadock/api-client";
import { create } from "zustand";

import { setAuthTokenProvider } from "../api/client";

export const AUTH_STORAGE_KEY = "lumadock.auth";

type StoredSession = {
  token: string;
  user: AuthUser;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  hydrate: () => void;
  logout: () => void;
  setSession: (response: AuthTokenResponse) => void;
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

const initialSession = readStoredSession();

export const useAuthStore = create<AuthState>((set) => ({
  hydrate: () => {
    const session = readStoredSession();
    set({
      isAuthenticated: Boolean(session?.token),
      token: session?.token ?? null,
      user: session?.user ?? null,
    });
  },
  isAuthenticated: Boolean(initialSession?.token),
  logout: () => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    set({ isAuthenticated: false, token: null, user: null });
  },
  setSession: (response) => {
    const session = {
      token: response.access_token,
      user: response.user,
    };
    writeStoredSession(session);
    set({ isAuthenticated: true, token: session.token, user: session.user });
  },
  token: initialSession?.token ?? null,
  user: initialSession?.user ?? null,
}));

setAuthTokenProvider(() => useAuthStore.getState().token);
