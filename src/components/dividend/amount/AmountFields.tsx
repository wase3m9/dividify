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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AmountFieldsProps {
  form: UseFormReturn<DividendAmountFormValues>;
}

export const AmountFields = ({ form }: AmountFieldsProps) => {
  const formatCurrency = (value: string) => {
    const cleanValue = value.replace(/[^\d.]/g, '');
    if (!cleanValue) return "";
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts[1];
    }
    const num = parseFloat(cleanValue);
    if (isNaN(num)) return "";
    if (cleanValue.includes('.')) {
      const decimalPart = parts[1] || '';
      if (decimalPart.length > 2) {
        return num.toFixed(2);
      }
      return cleanValue;
    }
    return cleanValue;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const value = e.target.value;
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

      <FormField
        control={form.control}
        name="paymentDate"
        render={({ field }) => (
          <FormItem className="text-left">
            <FormLabel>Payment Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(new Date(field.value), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => field.onChange(date?.toISOString() ?? '')}
                  disabled={(date) =>
                    date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};