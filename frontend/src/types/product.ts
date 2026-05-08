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

export type LeadResponse = LeadPayload & {
  id: number;
  created_at: string;
};

