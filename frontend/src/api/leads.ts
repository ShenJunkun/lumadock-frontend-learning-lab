import { apiRequest } from "./client";
import type { LeadPayload, LeadResponse } from "../types/product";

export function submitLead(payload: LeadPayload) {
  return apiRequest<LeadResponse>("/api/leads", {
    body: JSON.stringify(payload),
    method: "POST",
  });
}
