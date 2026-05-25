import { defineStore } from "pinia";

export const finishOptions = [
  { id: "graphite", label: "Graphite", color: "#252a32", price: 0 },
  { id: "pearl", label: "Pearl", color: "#f2f3ef", price: 20 },
  { id: "cobalt", label: "Cobalt", color: "#525ddc", price: 34 },
] as const;

export const standOptions = [
  { id: "desk", label: "Desk", price: 0 },
  { id: "floating", label: "Floating", price: 45 },
  { id: "wall", label: "Wall", price: 30 },
] as const;

export const planOptions = [
  { id: "solo", label: "Solo", price: 0 },
  { id: "studio", label: "Studio", price: 60 },
  { id: "team", label: "Team", price: 110 },
] as const;

export const configuratorPriorityOptions = [
  { id: "finish", label: "Finish" },
  { id: "stand", label: "Stand" },
  { id: "profile", label: "Profile" },
  { id: "engraving", label: "Engraving" },
] as const;

export type FinishId = (typeof finishOptions)[number]["id"];
export type StandId = (typeof standOptions)[number]["id"];
export type PlanId = (typeof planOptions)[number]["id"];
export type ConfiguratorPriorityId =
  (typeof configuratorPriorityOptions)[number]["id"];

export const defaultPriorityOrder = configuratorPriorityOptions.map(
  (option) => option.id,
);

export type ConfiguratorSnapshot = {
  finish: FinishId;
  stand: StandId;
  plan: PlanId;
  engraving: boolean;
  estimate: number;
  priorityOrder: ConfiguratorPriorityId[];
};

function priceFor<T extends { id: string; price: number }>(
  items: readonly T[],
  id: string,
) {
  return items.find((item) => item.id === id)?.price ?? 0;
}

export function normalizePriorityOrder(priorityOrder: readonly string[]) {
  const knownIds = new Set<string>(defaultPriorityOrder);
  const uniqueKnownIds = priorityOrder.filter((id, index) => {
    return knownIds.has(id) && priorityOrder.indexOf(id) === index;
  });
  const missingIds = defaultPriorityOrder.filter(
    (id) => !uniqueKnownIds.includes(id),
  );

  return [...uniqueKnownIds, ...missingIds] as ConfiguratorPriorityId[];
}

export const useConfiguratorStore = defineStore("configurator", {
  state: () => ({
    engraving: false,
    finish: "graphite" as FinishId,
    plan: "studio" as PlanId,
    priorityOrder: [...defaultPriorityOrder] as ConfiguratorPriorityId[],
    stand: "floating" as StandId,
  }),
  actions: {
    estimate(basePrice = 289) {
      return (
        basePrice +
        priceFor(finishOptions, this.finish) +
        priceFor(standOptions, this.stand) +
        priceFor(planOptions, this.plan) +
        (this.engraving ? 24 : 0)
      );
    },
    setEngraving(engraving: boolean) {
      this.engraving = engraving;
    },
    setFinish(finish: FinishId) {
      this.finish = finish;
    },
    setPlan(plan: PlanId) {
      this.plan = plan;
    },
    setPriorityOrder(priorityOrder: readonly string[]) {
      this.priorityOrder = normalizePriorityOrder(priorityOrder);
    },
    setStand(stand: StandId) {
      this.stand = stand;
    },
    snapshot(): ConfiguratorSnapshot {
      return {
        engraving: this.engraving,
        estimate: this.estimate(),
        finish: this.finish,
        plan: this.plan,
        priorityOrder: this.priorityOrder,
        stand: this.stand,
      };
    },
  },
});
