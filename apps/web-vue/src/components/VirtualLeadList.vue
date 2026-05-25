<script setup lang="ts">
import type { AdminLead } from "@lumadock/api-client";
import { useVirtualizer } from "@tanstack/vue-virtual";
import { ref } from "vue";

const props = defineProps<{
  leads: AdminLead[];
}>();

const parentRef = ref<HTMLDivElement | null>(null);
const virtualizer = useVirtualizer({
  count: props.leads.length,
  estimateSize: () => 82,
  getScrollElement: () => parentRef.value,
  overscan: 5,
});
</script>

<template>
  <p v-if="!leads.length" class="m-0 text-sm text-muted">
    No lead activity yet.
  </p>
  <div v-else ref="parentRef" class="virtual-list" aria-label="Lead activity">
    <div
      class="virtual-list-inner"
      :style="{ height: `${virtualizer.getTotalSize()}px` }"
    >
      <article
        v-for="virtualRow in virtualizer.getVirtualItems()"
        :key="leads[virtualRow.index].id"
        class="virtual-lead-row"
        :style="{ transform: `translateY(${virtualRow.start}px)` }"
      >
        <div>
          <strong>{{ leads[virtualRow.index].name }}</strong>
          <span>{{ leads[virtualRow.index].email }}</span>
        </div>
        <div>
          <span>
            {{
              leads[virtualRow.index].product_name ??
              leads[virtualRow.index].product_id ??
              "Unassigned"
            }}
          </span>
          <time :datetime="leads[virtualRow.index].created_at">
            {{ new Date(leads[virtualRow.index].created_at).toLocaleString() }}
          </time>
        </div>
      </article>
    </div>
  </div>
</template>
