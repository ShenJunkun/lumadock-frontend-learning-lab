import type { Product } from "../types/product";

export const fallbackProducts: Product[] = [
  {
    id: "lumadock-studio",
    name: "LumaDock Studio",
    tagline: "A calm command center for focused desk setups.",
    description:
      "Studio pairs a compact aluminum dock with adaptive edge lighting, quick device switching, and a warm charging shelf for everyday creative work.",
    category: "Desktop dock",
    price: 289,
    accent: "#16a3a3",
    hero_image: "/assets/lumadock-hero.png",
    features: [
      "Dual 4K display support",
      "Adaptive LumaRail edge lighting",
      "One-touch focus scene switching",
      "Quiet thermal shell",
    ],
    specs: {
      Ports: "2x USB-C, 3x USB-A, HDMI, DisplayPort, Ethernet",
      Charging: "100W laptop pass-through",
      Shell: "Brushed aluminum and matte polymer",
      Footprint: "182 x 74 x 26 mm",
    },
  },
  {
    id: "lumadock-air",
    name: "LumaDock Air",
    tagline: "A lighter dock for hybrid work and travel desks.",
    description:
      "Air keeps the same LumaDock interaction model in a slimmer body, with fewer ports and a more portable cable bay.",
    category: "Portable dock",
    price: 189,
    accent: "#f15a4a",
    hero_image: "/assets/lumadock-hero.png",
    features: [
      "Compact travel-ready housing",
      "Magnetic cable nest",
      "Low-glare status glow",
      "USB-C display and power delivery",
    ],
    specs: {
      Ports: "2x USB-C, 2x USB-A, HDMI",
      Charging: "85W laptop pass-through",
      Shell: "Pearl polymer and aluminum spine",
      Footprint: "146 x 62 x 18 mm",
    },
  },
  {
    id: "lumadock-max",
    name: "LumaDock Max",
    tagline: "The expanded desktop hub for multi-device studios.",
    description:
      "Max adds pro-grade ports, a brighter status surface, and a weighted stand for permanent workstation builds.",
    category: "Studio hub",
    price: 429,
    accent: "#525ddc",
    hero_image: "/assets/lumadock-hero.png",
    features: [
      "Triple display-ready port layout",
      "Weighted floating stand",
      "Device profile memory",
      "Expanded cooling channel",
    ],
    specs: {
      Ports: "3x USB-C, 4x USB-A, HDMI, 2x DisplayPort, SD, Ethernet",
      Charging: "140W laptop pass-through",
      Shell: "Graphite aluminum and glass light strip",
      Footprint: "224 x 88 x 31 mm",
    },
  },
];

