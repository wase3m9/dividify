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
    // Remove any existing commas and handle empty or invalid input
    const cleanValue = value.replace(/,/g, '');
    if (!cleanValue) return "";
    
    const num = parseFloat(cleanValue);
    if (isNaN(num)) return "";
    
    // Format with commas and always 2 decimal places
    return num.toLocaleString('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    // Only allow numbers and decimal point
    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
    
    // Ensure we only have one decimal point
    const parts = rawValue.split('.');
    const sanitizedValue = parts.length > 2 
      ? `${parts[0]}.${parts.slice(1).join('')}`
      : rawValue;
    
    onChange(sanitizedValue);
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
                  value={field.value ? formatCurrency(field.value) : ""}
                  onChange={(e) => handleInputChange(e, field.onChange)}
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
                  value={field.value ? formatCurrency(field.value) : ""}
                  onChange={(e) => handleInputChange(e, field.onChange)}
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