import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { DividendAmountFormValues } from "./types";

interface AmountFieldsProps {
  form: UseFormReturn<DividendAmountFormValues>;
}

export const AmountFields = ({ form }: AmountFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="amountPerShare"
        render={({ field }) => (
          <FormItem className="text-left">
            <FormLabel className="text-left">Net amount payable per share</FormLabel>
            <div className="relative">
              <span className="absolute left-3 top-2.5">£</span>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  className="pl-7"
                  placeholder="0.00"
                  {...field}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="totalAmount"
        render={({ field }) => (
          <FormItem className="text-left">
            <FormLabel className="text-left">Total dividend payable</FormLabel>
            <div className="relative">
              <span className="absolute left-3 top-2.5">£</span>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  className="pl-7"
                  placeholder="0.00"
                  {...field}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};