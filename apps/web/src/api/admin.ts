import type { AdminLead } from "@lumadock/api-client";

import { lumadockApiClient } from "./client";

export async function getAdminLeads(): Promise<AdminLead[]> {
  return lumadockApiClient.getAdminLeads();
}
