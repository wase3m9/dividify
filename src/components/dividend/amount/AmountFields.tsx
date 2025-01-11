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
  const formatCurrency = (value: string) => {
    // Remove any existing commas first
    const cleanValue = value.replace(/,/g, '');
    const num = parseFloat(cleanValue);
    if (isNaN(num)) return "";
    
    // Format with commas and always 2 decimal places
    return new Intl.NumberFormat('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

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
                  value={field.value ? formatCurrency(field.value.toString()) : ""}
                  onChange={(e) => {
                    // Only allow numbers and decimal point
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
                  value={field.value ? formatCurrency(field.value.toString()) : ""}
                  onChange={(e) => {
                    // Only allow numbers and decimal point
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