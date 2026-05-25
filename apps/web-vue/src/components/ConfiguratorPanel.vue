<script setup lang="ts">
import {
  ArrowDown,
  ArrowUp,
  Check,
  GripVertical,
  Sparkles,
} from "lucide-vue-next";
import { computed, ref } from "vue";

import {
  configuratorPriorityOptions,
  finishOptions,
  planOptions,
  standOptions,
  useConfiguratorStore,
  type ConfiguratorPriorityId,
  type FinishId,
  type PlanId,
  type StandId,
} from "../stores/configuratorStore";

const props = withDefaults(
  defineProps<{
    basePrice?: number;
  }>(),
  {
    basePrice: 289,
  },
);

const store = useConfiguratorStore();
const draggedPriority = ref<ConfiguratorPriorityId | null>(null);
const priorityStatus = ref("Configuration priority ready.");
const priorityOptionById = new Map(
  configuratorPriorityOptions.map((option) => [option.id, option]),
);

const estimate = computed(() => store.estimate(props.basePrice));
const priorityValues = computed<Record<ConfiguratorPriorityId, string>>(() => ({
  engraving: store.engraving ? "Included" : "Standard",
  finish:
    finishOptions.find((option) => option.id === store.finish)?.label ??
    store.finish,
  profile:
    planOptions.find((option) => option.id === store.plan)?.label ?? store.plan,
  stand:
    standOptions.find((option) => option.id === store.stand)?.label ??
    store.stand,
}));

function movePriority(priorityId: ConfiguratorPriorityId, direction: -1 | 1) {
  const currentIndex = store.priorityOrder.indexOf(priorityId);
  const nextIndex = currentIndex + direction;

  if (
    currentIndex < 0 ||
    nextIndex < 0 ||
    nextIndex >= store.priorityOrder.length
  ) {
    return;
  }

  const nextOrder = [...store.priorityOrder];
  const [item] = nextOrder.splice(currentIndex, 1);
  nextOrder.splice(nextIndex, 0, item);
  store.setPriorityOrder(nextOrder);
  const option = priorityOptionById.get(priorityId);
  priorityStatus.value = `${option?.label ?? priorityId} moved to position ${nextIndex + 1}.`;
}

function handleDrop(priorityId: ConfiguratorPriorityId) {
  if (!draggedPriority.value || draggedPriority.value === priorityId) {
    draggedPriority.value = null;
    return;
  }

  const oldIndex = store.priorityOrder.indexOf(draggedPriority.value);
  const newIndex = store.priorityOrder.indexOf(priorityId);
  if (oldIndex < 0 || newIndex < 0) {
    draggedPriority.value = null;
    return;
  }

  const nextOrder = [...store.priorityOrder];
  const [item] = nextOrder.splice(oldIndex, 1);
  nextOrder.splice(newIndex, 0, item);
  store.setPriorityOrder(nextOrder);
  const option = priorityOptionById.get(item);
  priorityStatus.value = `${option?.label ?? item} moved to position ${newIndex + 1}.`;
  draggedPriority.value = null;
}
</script>

<template>
  <section class="configurator" aria-labelledby="configurator-title">
    <div class="configurator-heading">
      <span class="tool-icon" aria-hidden="true">
        <Sparkles :size="18" />
      </span>
      <div>
        <span class="eyebrow">Configurator</span>
        <h2 id="configurator-title">Build a desk-ready setup</h2>
      </div>
    </div>

    <div class="control-group">
      <span class="control-label">Finish</span>
      <div class="swatch-grid" role="group" aria-label="Finish">
        <button
          v-for="option in finishOptions"
          :key="option.id"
          class="swatch-button"
          :class="{ 'is-selected': store.finish === option.id }"
          type="button"
          :aria-pressed="store.finish === option.id"
          @click="store.setFinish(option.id as FinishId)"
        >
          <span
            class="swatch"
            :style="{ background: option.color }"
            aria-hidden="true"
          />
          <span>{{ option.label }}</span>
        </button>
      </div>
    </div>

    <div class="control-group">
      <span class="control-label">Stand</span>
      <div class="segmented-control" role="group" aria-label="Stand">
        <button
          v-for="option in standOptions"
          :key="option.id"
          :class="{ 'is-selected': store.stand === option.id }"
          type="button"
          :aria-pressed="store.stand === option.id"
          @click="store.setStand(option.id as StandId)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div class="control-group">
      <span class="control-label">Profile</span>
      <div class="segmented-control" role="group" aria-label="Profile">
        <button
          v-for="option in planOptions"
          :key="option.id"
          :class="{ 'is-selected': store.plan === option.id }"
          type="button"
          :aria-pressed="store.plan === option.id"
          @click="store.setPlan(option.id as PlanId)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <label class="toggle-row">
      <input
        :checked="store.engraving"
        type="checkbox"
        @change="
          store.setEngraving(($event.target as HTMLInputElement).checked)
        "
      />
      <span aria-hidden="true">
        <Check :size="15" />
      </span>
      <strong>Personal engraving</strong>
    </label>

    <div class="control-group">
      <span class="control-label">Setup priority</span>
      <ol class="priority-list" aria-label="Configuration priority">
        <li
          v-for="(priorityId, index) in store.priorityOrder"
          :key="priorityId"
          class="priority-item"
          :class="{ 'is-dragging': draggedPriority === priorityId }"
          draggable="true"
          @dragstart="draggedPriority = priorityId"
          @dragover.prevent
          @drop="handleDrop(priorityId)"
        >
          <button
            class="priority-handle"
            type="button"
            :aria-label="`Reorder ${priorityOptionById.get(priorityId)?.label ?? priorityId}`"
            draggable="true"
            @dragstart="draggedPriority = priorityId"
          >
            <GripVertical :size="16" aria-hidden="true" />
          </button>
          <div class="priority-copy">
            <strong>{{
              priorityOptionById.get(priorityId)?.label ?? priorityId
            }}</strong>
            <span>{{ priorityValues[priorityId] }}</span>
          </div>
          <span
            class="priority-position"
            :aria-label="`${priorityOptionById.get(priorityId)?.label ?? priorityId} position ${index + 1} of ${store.priorityOrder.length}`"
          >
            {{ index + 1 }}
          </span>
          <div class="priority-actions">
            <button
              class="priority-icon-button"
              type="button"
              :aria-label="`Move ${priorityOptionById.get(priorityId)?.label ?? priorityId} earlier`"
              :disabled="index === 0"
              @click="movePriority(priorityId, -1)"
            >
              <ArrowUp :size="15" aria-hidden="true" />
            </button>
            <button
              class="priority-icon-button"
              type="button"
              :aria-label="`Move ${priorityOptionById.get(priorityId)?.label ?? priorityId} later`"
              :disabled="index === store.priorityOrder.length - 1"
              @click="movePriority(priorityId, 1)"
            >
              <ArrowDown :size="15" aria-hidden="true" />
            </button>
          </div>
        </li>
      </ol>
      <span class="visually-hidden" aria-live="polite">{{
        priorityStatus
      }}</span>
    </div>

    <div class="estimate-row" aria-live="polite">
      <span>Estimated setup</span>
      <strong>${{ estimate }}</strong>
    </div>
  </section>
</template>
