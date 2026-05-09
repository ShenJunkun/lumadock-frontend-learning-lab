import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { Send } from "lucide-react";
import { useEffect, useReducer } from "react";
import { useForm, useWatch } from "react-hook-form";

import { submitLead } from "../api/leads";
import {
  clearBookingDraft,
  getLeadFormDefaultValues,
  writeBookingDraft,
} from "../lib/bookingDrafts";
import { trackEvent } from "../lib/telemetry";
import { useConfiguratorStore } from "../store/configuratorStore";
import { leadFormSchema, type LeadFormValues } from "./leadFormSchema";
import { createLeadSubmissionState, leadSubmissionReducer } from "./leadSubmissionState";

type LeadFormProps = {
  productId?: string;
};

export function LeadForm({ productId }: LeadFormProps) {
  const snapshot = useConfiguratorStore((state) => state.snapshot);
  const [submissionState, dispatchSubmission] = useReducer(
    leadSubmissionReducer,
    productId,
    createLeadSubmissionState,
  );
  const mutation = useMutation({
    mutationFn: submitLead,
  });

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<LeadFormValues>({
    defaultValues: getLeadFormDefaultValues(productId),
    resolver: zodResolver(leadFormSchema),
    shouldFocusError: true,
  });
  const draftValues = useWatch({ control });

  useEffect(() => {
    reset(getLeadFormDefaultValues(productId));
    dispatchSubmission({ productId, type: "reset" });
  }, [productId, reset]);

  useEffect(() => {
    writeBookingDraft(productId, draftValues);
  }, [draftValues, productId]);

  const onSubmit = handleSubmit(async (values) => {
    const submittedProductId = values.productId || productId;
    dispatchSubmission({ productId: submittedProductId, type: "submit" });
    try {
      await mutation.mutateAsync({
        product_id: submittedProductId,
        name: values.name,
        email: values.email,
        company: values.company || undefined,
        role: values.role || undefined,
        message: values.message || undefined,
        configuration: snapshot(),
      });
      trackEvent("booking_submit_succeeded", {
        productId: submittedProductId ?? "unknown",
      });
      clearBookingDraft(submittedProductId);
      dispatchSubmission({ message: "Request saved locally.", type: "succeed" });
      void message.success("Request saved locally.");
      reset({
        productId,
        name: "",
        email: "",
        company: "",
        role: "",
        message: "",
        consent: false,
      });
    } catch {
      trackEvent("booking_submit_failed", {
        productId: submittedProductId ?? "unknown",
      });
      dispatchSubmission({
        message: "Could not reach the local API. Start FastAPI on port 8001 and try again.",
        type: "fail",
      });
      void message.error("Could not reach the local API.");
    }
  });

  return (
    <form className="lead-form" onSubmit={onSubmit}>
      <input type="hidden" value={productId ?? ""} {...register("productId")} />

      <div className="form-grid">
        <label>
          <span>Name</span>
          <input aria-invalid={Boolean(errors.name)} autoComplete="name" {...register("name")} />
          {errors.name && <small>{errors.name.message}</small>}
        </label>

        <label>
          <span>Email</span>
          <input
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            inputMode="email"
            {...register("email")}
          />
          {errors.email && <small>{errors.email.message}</small>}
        </label>

        <label>
          <span>Company</span>
          <input autoComplete="organization" {...register("company")} />
        </label>

        <label>
          <span>Role</span>
          <input autoComplete="organization-title" {...register("role")} />
        </label>
      </div>

      <label>
        <span>Project notes</span>
        <textarea rows={4} {...register("message")} />
        {errors.message && <small>{errors.message.message}</small>}
      </label>

      <label className="checkbox-line">
        <input type="checkbox" {...register("consent")} />
        <span>This local demo can store the request in SQLite.</span>
      </label>
      {errors.consent && <small className="form-error">{errors.consent.message}</small>}

      {submissionState.status === "error" && submissionState.message && (
        <div className="inline-alert" role="alert">
          {submissionState.message}
        </div>
      )}
      {submissionState.status === "success" && submissionState.message && (
        <div className="inline-success" role="status">
          {submissionState.message}
        </div>
      )}

      <button
        className="primary-button"
        type="submit"
        disabled={isSubmitting || submissionState.status === "submitting"}
      >
        <Send size={17} aria-hidden="true" />
        <span>{submissionState.status === "submitting" ? "Sending" : "Send request"}</span>
      </button>
    </form>
  );
}
