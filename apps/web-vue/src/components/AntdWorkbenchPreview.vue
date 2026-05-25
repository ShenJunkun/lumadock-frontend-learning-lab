<script setup lang="ts">
import {
  Button as AButton,
  Modal as AModal,
  Result as AResult,
  Table as ATable,
  Tag as ATag,
} from "ant-design-vue";
import { h, ref } from "vue";

type PreviewLead = {
  key: string;
  name: string;
  product: string;
  status: "new" | "qualified" | "scheduled";
};

const isOpen = ref(false);
const previewLeads: PreviewLead[] = [
  {
    key: "1",
    name: "Ada Lovelace",
    product: "LumaDock Studio",
    status: "new",
  },
  {
    key: "2",
    name: "Grace Hopper",
    product: "LumaDock Max",
    status: "scheduled",
  },
];

const columns = [
  {
    dataIndex: "name",
    title: "Lead",
  },
  {
    dataIndex: "product",
    title: "Product",
  },
  {
    dataIndex: "status",
    customRender: ({ text }: { text: PreviewLead["status"] }) => {
      const color =
        text === "new" ? "cyan" : text === "qualified" ? "blue" : "green";
      return h(ATag, { color }, () => text);
    },
    title: "Status",
  },
];
</script>

<template>
  <section
    class="mt-8 rounded-ui border border-line bg-surface p-4 shadow-soft"
  >
    <div
      class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
    >
      <div>
        <span class="eyebrow">Ant Design Vue</span>
        <h2 class="m-0 text-2xl font-extrabold leading-tight">
          Component workbench
        </h2>
      </div>
      <AButton type="primary" @click="isOpen = true">Open modal</AButton>
    </div>

    <ATable
      :columns="columns"
      :data-source="previewLeads"
      :pagination="false"
      :scroll="{ x: true }"
      size="middle"
    />

    <AModal
      v-model:open="isOpen"
      title="Admin workflow preview"
      ok-text="Got it"
      @ok="isOpen = false"
    >
      <AResult
        status="success"
        title="Ant Design Vue is wired into the app shell"
        sub-title="The real admin table reuses this theme, modal, and table pattern."
      />
    </AModal>
  </section>
</template>
