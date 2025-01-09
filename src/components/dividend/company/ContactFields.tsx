import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CompanyFormData } from "./types";

interface ContactFieldsProps {
  form: UseFormReturn<CompanyFormData>;
}

export const ContactFields = ({ form }: ContactFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="trade_classification"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Trade Classification</FormLabel>
            <FormControl>
              <Input placeholder="Enter trade classification" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="registered_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Registered Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Enter registered email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="incorporation_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Incorporation Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};