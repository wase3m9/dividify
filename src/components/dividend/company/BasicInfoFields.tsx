import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CompanyFormData } from "./types";

interface BasicInfoFieldsProps {
  form: UseFormReturn<CompanyFormData>;
}

export const BasicInfoFields = ({ form }: BasicInfoFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter company name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="registration_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Registration Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter registration number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="registered_address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Registered Address</FormLabel>
            <FormControl>
              <Input placeholder="Enter registered address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};