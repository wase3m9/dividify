import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const formSchema = z.object({
  shareholderName: z.string().min(1, "Shareholder name is required"),
  shareClass: z.string().min(1, "Share class is required"),
  description: z.string().min(1, "Description is required"),
  paymentDate: z.string().min(1, "Payment date is required"),
  financialYearEnding: z.string().min(1, "Financial year ending is required"),
});

export type ShareholderDetails = z.infer<typeof formSchema>;

interface ShareholderDetailsFormProps {
  onSubmit: (data: ShareholderDetails) => void;
  onPrevious: () => void;
  initialData?: ShareholderDetails;
}

export const ShareholderDetailsForm = ({ onSubmit, onPrevious, initialData }: ShareholderDetailsFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<ShareholderDetails>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shareholderName: "",
      shareClass: "",
      description: "",
      paymentDate: "",
      financialYearEnding: "",
    }
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = (data: ShareholderDetails) => {
    if (Object.keys(form.formState.errors).length > 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="shareholderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shareholder name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter shareholder name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shareClass"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Share class</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter share class" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select description" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="final">Final dividend for the year</SelectItem>
                  <SelectItem value="interim">Interim dividend for the year</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="financialYearEnding"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Financial year ending</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <NavigationButtons
          onPrevious={onPrevious}
          previousLabel="Cancel"
          type="submit"
        />
      </form>
    </Form>
  );
};