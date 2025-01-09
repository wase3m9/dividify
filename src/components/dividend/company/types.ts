import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  registration_number: z.string().optional(),
  registered_address: z.string().optional(),
});

export type CompanyFormData = z.infer<typeof formSchema>;