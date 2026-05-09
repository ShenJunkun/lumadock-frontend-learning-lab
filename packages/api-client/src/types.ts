export type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  price: number;
  accent: string;
  hero_image: string;
  features: string[];
  specs: Record<string, string>;
};

export type Stats = {
  products: number;
  leads: number;
  average_price: number;
  latest_lead_at: string | null;
};

export type LeadPayload = {
  product_id?: string;
  name: string;
  email: string;
  company?: string;
  role?: string;
  message?: string;
  configuration: Record<string, unknown>;
};

export type LeadResponse = {
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  message: string | null;
  configuration: Record<string, unknown>;
  id: number;
  product_id: string | null;
  created_at: string;
};

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

export type AdminLead = LeadResponse & {
  product_name: string | null;
};
