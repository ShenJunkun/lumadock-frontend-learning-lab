function readApiBaseUrl() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!apiBaseUrl) {
    throw new Error("VITE_API_BASE_URL is required. Copy frontend/.env.example first.");
  }
  return apiBaseUrl.replace(/\/$/, "");
}

export const API_BASE_URL = readApiBaseUrl();

let authTokenProvider: () => string | null = () => null;

export function setAuthTokenProvider(provider: () => string | null) {
  authTokenProvider = provider;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = authTokenProvider();
  const response = await fetch(`${API_BASE_URL}${path}`, {
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
