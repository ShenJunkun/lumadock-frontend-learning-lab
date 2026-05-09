import { z } from "zod";

export const ProductSchema = z.object({
  accent: z.string(),
  category: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  hero_image: z.string(),
  id: z.string(),
  name: z.string(),
  price: z.number(),
  specs: z.record(z.string()),
  tagline: z.string(),
});

export const ProductsSchema = z.array(ProductSchema);

export const StatsSchema = z.object({
  average_price: z.number(),
  latest_lead_at: z.string().nullable(),
  leads: z.number(),
  products: z.number(),
});

export const AuthUserSchema = z.object({
  email: z.string(),
  id: z.number(),
  name: z.string(),
  role: z.enum(["admin", "viewer"]),
});

export const TokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.literal("bearer"),
  user: AuthUserSchema,
});

export const LeadResponseSchema = z.object({
  company: z.string().nullable(),
  configuration: z.record(z.unknown()),
  created_at: z.string(),
  email: z.string(),
  id: z.number(),
  message: z.string().nullable(),
  name: z.string(),
  product_id: z.string().nullable(),
  role: z.string().nullable(),
});

export const AdminLeadSchema = LeadResponseSchema.extend({
  product_name: z.string().nullable(),
});

export const AdminLeadsSchema = z.array(AdminLeadSchema);
