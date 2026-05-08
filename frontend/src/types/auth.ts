export type UserRole = "admin" | "viewer";

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  role: UserRole;
};

export type AuthTokenResponse = {
  access_token: string;
  token_type: "bearer";
  user: AuthUser;
};

export type AdminLead = {
  id: number;
  product_id: string | null;
  product_name: string | null;
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  message: string | null;
  configuration: Record<string, unknown>;
  created_at: string;
};
