<script setup lang="ts">
import type { AdminLead } from "@lumadock/api-client";
import { StatusBadge, SurfaceCard } from "@lumadock/ui-vue";
import { useQuery } from "@tanstack/vue-query";
import {
  Button as AButton,
  Descriptions as ADescriptions,
  DescriptionsItem as ADescriptionsItem,
  Modal as AModal,
  notification,
  Result as AResult,
  Table as ATable,
} from "ant-design-vue";
import { computed, h, ref, watch } from "vue";

import { getAdminLeads } from "../api/admin";
import AdminInsights from "../components/AdminInsights.vue";
import { AdminTableSkeleton } from "../components/SkeletonStates";
import VirtualLeadList from "../components/VirtualLeadList.vue";
import { isFeatureEnabled } from "../lib/featureFlags";
import { useAuthStore } from "../stores/authStore";

const auth = useAuthStore();
const selectedLead = ref<AdminLead | null>(null);
const showAdminInsights = isFeatureEnabled("adminInsights");
const leadsQuery = useQuery({
  enabled: computed(() => auth.user?.role === "admin"),
  queryFn: getAdminLeads,
  queryKey: ["admin", "leads"],
});
const leads = computed(() => leadsQuery.data.value ?? []);

watch(
  () => leadsQuery.isError.value,
  (isError) => {
    if (isError) {
      notification.error({
        description:
          "Start FastAPI on port 8001 and log in with an admin token.",
        message: "Admin API unavailable",
      });
    }
  },
);

const columns = [
  {
    dataIndex: "name",
    title: "Lead",
  },
  {
    dataIndex: "email",
    title: "Email",
  },
  {
    dataIndex: "product_name",
    customRender: ({ text }: { text: string | null }) => text ?? "Unassigned",
    title: "Product",
  },
  {
    dataIndex: "created_at",
    customRender: ({ text }: { text: string }) =>
      new Date(text).toLocaleString(),
    title: "Created",
  },
  {
    customRender: ({ record }: { record: AdminLead }) =>
      h(
        AButton,
        {
          type: "link",
          onClick: () => {
            selectedLead.value = record;
          },
        },
        () => "View",
      ),
    title: "Action",
  },
];
</script>

<template>
  <section v-if="auth.user?.role !== 'admin'" class="page-section">
    <AResult
      status="403"
      title="No access"
      sub-title="Admin users can read this lead console."
    />
  </section>

  <section v-else-if="leadsQuery.isError.value" class="page-section">
    <AResult
      status="warning"
      title="Admin API unavailable"
      sub-title="Start FastAPI on port 8001 and log in with an admin token."
    />
  </section>

  <section v-else class="page-section">
    <div class="section-heading">
      <span class="eyebrow">Admin</span>
      <h1>Lead console</h1>
      <p>Protected by JWT and the admin role.</p>
    </div>

    <SurfaceCard>
      <div
        class="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h2 class="m-0 text-2xl font-extrabold">预约线索</h2>
          <p class="m-0 text-sm text-muted">
            Only admin users can read this table.
          </p>
        </div>
        <StatusBadge tone="accent">admin only</StatusBadge>
      </div>

      <AdminTableSkeleton v-if="leadsQuery.isLoading.value" />
      <template v-else>
        <AdminInsights v-if="showAdminInsights" :leads="leads" />
        <section class="activity-panel" aria-labelledby="lead-activity-title">
          <h3 id="lead-activity-title">Lead activity</h3>
          <VirtualLeadList :leads="leads" />
        </section>
        <ATable
          :columns="columns"
          :data-source="leads"
          :locale="{ emptyText: 'No leads yet' }"
          :pagination="{ pageSize: 5 }"
          row-key="id"
          :scroll="{ x: true }"
        />
      </template>
    </SurfaceCard>

    <AModal
      :open="Boolean(selectedLead)"
      :title="selectedLead?.name"
      @cancel="selectedLead = null"
    >
      <template #footer>
        <AButton @click="selectedLead = null">Close</AButton>
      </template>
      <ADescriptions v-if="selectedLead" :column="1" bordered size="small">
        <ADescriptionsItem label="Email">{{
          selectedLead.email
        }}</ADescriptionsItem>
        <ADescriptionsItem label="Company">
          {{ selectedLead.company ?? "None" }}
        </ADescriptionsItem>
        <ADescriptionsItem label="Role">{{
          selectedLead.role ?? "None"
        }}</ADescriptionsItem>
        <ADescriptionsItem label="Product">
          {{
            selectedLead.product_name ?? selectedLead.product_id ?? "Unassigned"
          }}
        </ADescriptionsItem>
        <ADescriptionsItem label="Message">
          {{ selectedLead.message ?? "None" }}
        </ADescriptionsItem>
        <ADescriptionsItem label="Configuration">
          <pre class="m-0 whitespace-pre-wrap text-xs">{{
            JSON.stringify(selectedLead.configuration, null, 2)
          }}</pre>
        </ADescriptionsItem>
      </ADescriptions>
    </AModal>
  </section>
</template>
