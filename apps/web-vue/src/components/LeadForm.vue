<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import { message } from "ant-design-vue";
import { Send } from "lucide-vue-next";
import { reactive, ref, watch } from "vue";
import { ZodError } from "zod";

import { submitLead } from "../api/leads";
import {
  clearBookingDraft,
  getLeadFormDefaultValues,
  writeBookingDraft,
} from "../lib/bookingDrafts";
import { trackEvent } from "../lib/telemetry";
import { useConfiguratorStore } from "../stores/configuratorStore";
import { leadFormSchema, type LeadFormValues } from "./leadFormSchema";
import {
  createLeadSubmissionState,
  leadSubmissionReducer,
} from "./leadSubmissionState";

const props = defineProps<{
  productId?: string;
}>();

const configurator = useConfiguratorStore();
const mutation = useMutation({ mutationFn: submitLead });
const form = reactive<LeadFormValues>(
  getLeadFormDefaultValues(props.productId),
);
const errors = reactive<Partial<Record<keyof LeadFormValues, string>>>({});
const submissionState = ref(createLeadSubmissionState(props.productId));

function dispatchSubmission(
  action: Parameters<typeof leadSubmissionReducer>[1],
) {
  submissionState.value = leadSubmissionReducer(submissionState.value, action);
}

function resetForm(values: LeadFormValues) {
  Object.assign(form, values);
  Object.keys(errors).forEach((key) => {
    delete errors[key as keyof LeadFormValues];
  });
}

function setValidationErrors(error: ZodError<LeadFormValues>) {
  Object.keys(errors).forEach((key) => {
    delete errors[key as keyof LeadFormValues];
  });
  error.issues.forEach((issue) => {
    const key = issue.path[0] as keyof LeadFormValues | undefined;
    if (key && !errors[key]) {
      errors[key] = issue.message;
    }
  });
}

watch(
  () => props.productId,
  (productId) => {
    resetForm(getLeadFormDefaultValues(productId));
    dispatchSubmission({ productId, type: "reset" });
  },
);

watch(
  form,
  (values) => {
    writeBookingDraft(props.productId, values);
  },
  { deep: true },
);

async function onSubmit() {
  const parsed = leadFormSchema.safeParse({
    ...form,
    productId: props.productId,
  });
  if (!parsed.success) {
    setValidationErrors(parsed.error);
    return;
  }

  const values = parsed.data;
  const submittedProductId = values.productId || props.productId;
  dispatchSubmission({ productId: submittedProductId, type: "submit" });

  try {
    await mutation.mutateAsync({
      company: values.company || undefined,
      configuration: configurator.snapshot(),
      email: values.email,
      message: values.message || undefined,
      name: values.name,
      product_id: submittedProductId,
      role: values.role || undefined,
    });
    trackEvent("booking_submit_succeeded", {
      productId: submittedProductId ?? "unknown",
    });
    clearBookingDraft(submittedProductId);
    dispatchSubmission({ message: "Request saved locally.", type: "succeed" });
    void message.success("Request saved locally.");
    resetForm({
      company: "",
      consent: false,
      email: "",
      message: "",
      name: "",
      productId: props.productId,
      role: "",
    });
  } catch {
    trackEvent("booking_submit_failed", {
      productId: submittedProductId ?? "unknown",
    });
    dispatchSubmission({
      message:
        "Could not reach the local API. Start FastAPI on port 8001 and try again.",
      type: "fail",
    });
    void message.error("Could not reach the local API.");
  }
}
</script>

<template>
  <form class="lead-form" @submit.prevent="onSubmit">
    <input v-model="form.productId" type="hidden" />

    <div class="form-grid">
      <label>
        <span>Name</span>
        <input
          v-model="form.name"
          :aria-invalid="Boolean(errors.name)"
          autocomplete="name"
        />
        <small v-if="errors.name">{{ errors.name }}</small>
      </label>

      <label>
        <span>Email</span>
        <input
          v-model="form.email"
          :aria-invalid="Boolean(errors.email)"
          autocomplete="email"
          inputmode="email"
        />
        <small v-if="errors.email">{{ errors.email }}</small>
      </label>

      <label>
        <span>Company</span>
        <input v-model="form.company" autocomplete="organization" />
      </label>

      <label>
        <span>Role</span>
        <input v-model="form.role" autocomplete="organization-title" />
      </label>
    </div>

    <label>
      <span>Project notes</span>
      <textarea v-model="form.message" rows="4" />
      <small v-if="errors.message">{{ errors.message }}</small>
    </label>

    <label class="checkbox-line">
      <input v-model="form.consent" type="checkbox" />
      <span>This local demo can store the request in SQLite.</span>
    </label>
    <small v-if="errors.consent" class="form-error">{{ errors.consent }}</small>

    <div
      v-if="submissionState.status === 'error' && submissionState.message"
      class="inline-alert"
      role="alert"
    >
      {{ submissionState.message }}
    </div>
    <div
      v-if="submissionState.status === 'success' && submissionState.message"
      class="inline-success"
      role="status"
    >
      {{ submissionState.message }}
    </div>

    <button
      class="primary-button"
      type="submit"
      :disabled="
        mutation.isPending.value || submissionState.status === 'submitting'
      "
    >
      <Send :size="17" aria-hidden="true" />
      <span>{{
        submissionState.status === "submitting" ? "Sending" : "Send request"
      }}</span>
    </button>
  </form>
</template>
