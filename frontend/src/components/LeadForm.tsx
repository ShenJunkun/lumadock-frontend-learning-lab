import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";

import { submitLead } from "../api/leads";
import { useConfiguratorStore } from "../store/configuratorStore";
import { leadFormSchema, type LeadFormValues } from "./leadFormSchema";

type LeadFormProps = {
  productId?: string;
};

export function LeadForm({ productId }: LeadFormProps) {
  const snapshot = useConfiguratorStore((state) => state.snapshot);
  const mutation = useMutation({
    mutationFn: submitLead,
  });

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<LeadFormValues>({
    defaultValues: {
      productId,
      name: "",
      email: "",
      company: "",
      role: "",
      message: "",
      consent: false,
    },
    resolver: zodResolver(leadFormSchema),
    shouldFocusError: true,
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({
        product_id: values.productId || productId,
        name: values.name,
        email: values.email,
        company: values.company || undefined,
        role: values.role || undefined,
        message: values.message || undefined,
        configuration: snapshot(),
      });
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

      {mutation.isError && (
        <div className="inline-alert" role="alert">
          Could not reach the local API. Start FastAPI on port 8001 and try again.
        </div>
      )}
      {mutation.isSuccess && (
        <div className="inline-success" role="status">
          Request saved locally.
        </div>
      )}

      <button
        className="primary-button"
        type="submit"
        disabled={isSubmitting || mutation.isPending}
      >
        <Send size={17} aria-hidden="true" />
        <span>{mutation.isPending ? "Sending" : "Send request"}</span>
      </button>
    </form>
  );
}
