import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  registration_number: z.string().optional(),
  registered_address: z.string().optional(),
  trade_classification: z.string().optional(),
  registered_email: z.string().email().optional().or(z.literal("")),
  incorporation_date: z.string().optional(),
  company_category: z.string().optional(),
  trading_on_market: z.boolean().default(false),
  company_status: z.string().default("Active"),
  accounting_category: z.string().optional()
});

export type CompanyFormData = z.infer<typeof formSchema>;