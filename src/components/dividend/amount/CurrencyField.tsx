import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { DividendAmountFormValues } from "./types";

interface CurrencyFieldProps {
  form: UseFormReturn<DividendAmountFormValues>;
}

export const CurrencyField = ({ form }: CurrencyFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="currency"
      render={({ field }) => (
        <FormItem className="text-left">
          <FormLabel className="text-left">Currency of dividend</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="GBP">£ - GB Pound</SelectItem>
              <SelectItem value="USD">$ - US Dollar</SelectItem>
              <SelectItem value="EUR">€ - Euro</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};