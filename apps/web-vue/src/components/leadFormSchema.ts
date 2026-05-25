import { z } from "zod";

export const leadFormSchema = z.object({
  productId: z.string().optional(),
  name: z.string().min(2, "Name needs at least 2 characters."),
  email: z.string().email("Use a valid email address."),
  company: z.string().max(160).optional(),
  role: z.string().max(120).optional(),
  message: z
    .string()
    .max(600, "Keep the note under 600 characters.")
    .optional(),
  consent: z
    .boolean()
    .refine(Boolean, "Confirm that this is a local demo request."),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;
