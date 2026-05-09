import { apiRequest } from "./client";
import { LeadResponseSchema } from "./contracts";
import type { LeadPayload, LeadResponse } from "../types/product";

export async function submitLead(payload: LeadPayload): Promise<LeadResponse> {
  return LeadResponseSchema.parse(
    await apiRequest<unknown>("/api/leads", {
      body: JSON.stringify(payload),
      method: "POST",
    }),
  );
}
