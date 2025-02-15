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
  shareholderAddress: z.string().min(1, "Shareholder address is required"),
  numberOfShares: z.string().min(1, "Number of shares is required"),
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
      shareholderAddress: "",
      numberOfShares: "",
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 text-left">
        <FormField
          control={form.control}
          name="shareholderName"
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel className="text-left">Shareholder name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter shareholder name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shareholderAddress"
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel className="text-left">Shareholder address</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter shareholder address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shareClass"
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel className="text-left">Share class</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select share class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Ordinary">Ordinary share</SelectItem>
                  <SelectItem value="Preference">Preference share</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numberOfShares"
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel className="text-left">Number of shares</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="number" 
                  min="1"
                  placeholder="Enter number of shares" 
                />
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