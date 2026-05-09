import type { LeadPayload, LeadResponse } from "@lumadock/api-client";

import { lumadockApiClient } from "./client";

export async function submitLead(payload: LeadPayload): Promise<LeadResponse> {
  return lumadockApiClient.submitLead(payload);
}
