import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  registration_number: z.string().optional(),
  registered_address: z.string().optional(),
  registered_email: z.string().email("Invalid email address").optional().or(z.literal("")),
});

export type CompanyFormData = z.infer<typeof formSchema>;