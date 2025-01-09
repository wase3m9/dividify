import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { CompanyFormData } from "./types";

interface CategoryFieldsProps {
  form: UseFormReturn<CompanyFormData>;
}

export const CategoryFields = ({ form }: CategoryFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="company_category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select company category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="private-limited">Private Limited Company</SelectItem>
                <SelectItem value="public-limited">Public Limited Company</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="sole-trader">Sole Trader</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="trading_on_market"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Trading on Market</FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="company_status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select company status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Dormant">Dormant</SelectItem>
                <SelectItem value="In Administration">In Administration</SelectItem>
                <SelectItem value="Dissolved">Dissolved</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="accounting_category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Accounting Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select accounting category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="micro-entity">Micro-entity</SelectItem>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};