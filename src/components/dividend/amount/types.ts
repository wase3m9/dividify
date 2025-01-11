import { z } from "zod";

export const formSchema = z.object({
  currency: z.string().min(1, "Currency is required"),
  amountPerShare: z.string().min(1, "Amount per share is required"),
  totalAmount: z.string().min(1, "Total amount is required"),
  paymentDate: z.string().min(1, "Payment date is required"),
});

export type DividendAmountFormValues = z.infer<typeof formSchema>;