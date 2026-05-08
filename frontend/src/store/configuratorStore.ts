import { create } from "zustand";

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

export type FinishId = (typeof finishOptions)[number]["id"];
export type StandId = (typeof standOptions)[number]["id"];
export type PlanId = (typeof planOptions)[number]["id"];

type ConfiguratorState = {
  finish: FinishId;
  stand: StandId;
  plan: PlanId;
  engraving: boolean;
  setFinish: (finish: FinishId) => void;
  setStand: (stand: StandId) => void;
  setPlan: (plan: PlanId) => void;
  setEngraving: (engraving: boolean) => void;
  estimate: (basePrice?: number) => number;
  snapshot: () => Record<string, string | boolean | number>;
};

function priceFor<T extends { id: string; price: number }>(items: readonly T[], id: string) {
  return items.find((item) => item.id === id)?.price ?? 0;
}

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  finish: "graphite",
  stand: "floating",
  plan: "studio",
  engraving: false,
  setFinish: (finish) => set({ finish }),
  setStand: (stand) => set({ stand }),
  setPlan: (plan) => set({ plan }),
  setEngraving: (engraving) => set({ engraving }),
  estimate: (basePrice = 289) => {
    const state = get();
    return (
      basePrice +
      priceFor(finishOptions, state.finish) +
      priceFor(standOptions, state.stand) +
      priceFor(planOptions, state.plan) +
      (state.engraving ? 24 : 0)
    );
  },
  snapshot: () => {
    const state = get();
    return {
      finish: state.finish,
      stand: state.stand,
      plan: state.plan,
      engraving: state.engraving,
      estimate: state.estimate(),
    };
  },
}));

