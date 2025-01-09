import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { NavigationButtons } from "./NavigationButtons";

export interface ShareholderDetails {
  shareholderName: string;
  shareClass: string;
  shareholdings: string;
}

interface ShareholderDetailsFormProps {
  onSubmit: (data: ShareholderDetails) => void;
  onPrevious: () => void;
}

export const ShareholderDetailsForm = ({ onSubmit, onPrevious }: ShareholderDetailsFormProps) => {
  const form = useForm<ShareholderDetails>({
    defaultValues: {
      shareholderName: "",
      shareClass: "",
      shareholdings: ""
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="shareholderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shareholder name</FormLabel>
              <FormControl>
                <Input placeholder="Enter shareholder name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shareClass"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Share class</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select share class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ordinary">Ordinary Shares</SelectItem>
                  <SelectItem value="preference">Preference Shares</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shareholdings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Share holdings</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Enter number of shares" 
                  {...field} 
                />
              </FormControl>
            </FormItem>
          )}
        />

        <NavigationButtons
          onPrevious={onPrevious}
          onNext={() => {}}  // This is handled by form submission
          previousLabel="Cancel"
          type="submit"
        />
      </form>
    </Form>
  );
};