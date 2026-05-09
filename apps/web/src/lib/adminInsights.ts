import type { AdminLead } from "@lumadock/api-client";

export type InsightDatum = {
  name: string;
  value: number;
};

export type DailyLeadDatum = {
  date: string;
  leads: number;
};

function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function toSortedDatum(map: Map<string, number>): InsightDatum[] {
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((left, right) => right.value - left.value || left.name.localeCompare(right.name));
}

export function buildProductLeadCounts(leads: AdminLead[]): InsightDatum[] {
  const counts = new Map<string, number>();
  leads.forEach((lead) => {
    increment(counts, lead.product_name ?? lead.product_id ?? "Unassigned");
  });
  return toSortedDatum(counts);
}

export function buildFinishLeadCounts(leads: AdminLead[]): InsightDatum[] {
  const counts = new Map<string, number>();
  leads.forEach((lead) => {
    const finish = lead.configuration.finish;
    increment(counts, typeof finish === "string" ? finish : "Unknown");
  });
  return toSortedDatum(counts);
}

export function buildDailyLeadCounts(leads: AdminLead[]): DailyLeadDatum[] {
  const counts = new Map<string, number>();
  leads.forEach((lead) => {
    increment(counts, new Date(lead.created_at).toISOString().slice(0, 10));
  });
  return [...counts.entries()]
    .map(([date, leadCount]) => ({ date, leads: leadCount }))
    .sort((left, right) => left.date.localeCompare(right.date));
}
