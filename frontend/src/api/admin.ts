import { apiRequest } from "./client";
import type { AdminLead } from "../types/auth";

export function getAdminLeads() {
  return apiRequest<AdminLead[]>("/api/admin/leads");
}
