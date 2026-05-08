import { apiRequest } from "./client";
import { AdminLeadsSchema } from "./contracts";
import type { AdminLead } from "../types/auth";

export async function getAdminLeads(): Promise<AdminLead[]> {
  return AdminLeadsSchema.parse(await apiRequest<unknown>("/api/admin/leads"));
}
