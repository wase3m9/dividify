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
    // Remove any non-numeric characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    
    // Handle empty or invalid input
    if (!cleanValue) return "";
    
    // Ensure only one decimal point
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts[1];
    }
    
    const num = parseFloat(cleanValue);
    if (isNaN(num)) return "";
    
    // If there's a decimal point, maintain the exact input precision up to 2 places
    if (cleanValue.includes('.')) {
      const decimalPart = parts[1] || '';
      if (decimalPart.length > 2) {
        return num.toFixed(2);
      }
      return cleanValue;
    }
    
    // For whole numbers, return as is
    return cleanValue;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const value = e.target.value;
    // Allow numbers and one decimal point
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      onChange(value);
    }
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