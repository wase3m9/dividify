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
import { useEffect } from "react";

interface AmountFieldsProps {
  form: UseFormReturn<DividendAmountFormValues>;
}

export const AmountFields = ({ form }: AmountFieldsProps) => {
  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "";
    return num.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "amountPerShare" || name === "totalAmount") {
        const fieldValue = value[name as keyof DividendAmountFormValues];
        if (fieldValue) {
          form.setValue(name as keyof DividendAmountFormValues, formatCurrency(fieldValue.toString()));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

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
                  type="text"
                  className="pl-7"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, '');
                    field.onChange(value);
                  }}
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
                  type="text"
                  className="pl-7"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, '');
                    field.onChange(value);
                  }}
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