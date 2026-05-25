<script setup lang="ts">
import type { AdminLead } from "@lumadock/api-client";
import { Empty as AEmpty } from "ant-design-vue";
import VChart from "vue-echarts";
import "echarts";
import { computed } from "vue";

import {
  buildDailyLeadCounts,
  buildFinishLeadCounts,
  buildProductLeadCounts,
} from "../lib/adminInsights";

const props = defineProps<{
  leads: AdminLead[];
}>();

const chartColors = ["#16a3a3", "#f15a4a", "#525ddc", "#a4c639"];
const productCounts = computed(() => buildProductLeadCounts(props.leads));
const finishCounts = computed(() => buildFinishLeadCounts(props.leads));
const dailyCounts = computed(() => buildDailyLeadCounts(props.leads));

const productOption = computed(() => ({
  color: chartColors,
  grid: { bottom: 34, left: 36, right: 12, top: 12 },
  series: [
    {
      barMaxWidth: 38,
      data: productCounts.value.map((item) => item.value),
      type: "bar",
    },
  ],
  tooltip: {},
  xAxis: {
    data: productCounts.value.map((item) => item.name),
    type: "category",
  },
  yAxis: { minInterval: 1, type: "value" },
}));

const dailyOption = computed(() => ({
  color: ["#525ddc"],
  grid: { bottom: 34, left: 36, right: 12, top: 12 },
  series: [
    {
      data: dailyCounts.value.map((item) => item.leads),
      smooth: true,
      type: "line",
    },
  ],
  tooltip: {},
  xAxis: { data: dailyCounts.value.map((item) => item.date), type: "category" },
  yAxis: { minInterval: 1, type: "value" },
}));

const finishOption = computed(() => ({
  color: chartColors,
  series: [
    {
      data: finishCounts.value,
      innerRadius: "58%",
      radius: ["48%", "78%"],
      type: "pie",
    },
  ],
  tooltip: {},
}));
</script>

<template>
  <div v-if="!leads.length" class="insight-empty">
    <AEmpty description="No lead insights yet" />
  </div>

  <div v-else class="insight-grid" aria-label="Lead insights">
    <section class="insight-panel">
      <span class="eyebrow">Products</span>
      <h3>Lead mix</h3>
      <VChart
        :option="productOption"
        style="width: 100%; height: 220px"
        autoresize
      />
    </section>

    <section class="insight-panel">
      <span class="eyebrow">Timeline</span>
      <h3>Daily leads</h3>
      <VChart
        :option="dailyOption"
        style="width: 100%; height: 220px"
        autoresize
      />
    </section>

    <section class="insight-panel">
      <span class="eyebrow">Configuration</span>
      <h3>Finish demand</h3>
      <VChart
        :option="finishOption"
        style="width: 100%; height: 220px"
        autoresize
      />
    </section>
  </div>
</template>
