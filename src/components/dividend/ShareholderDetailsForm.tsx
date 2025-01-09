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

const formSchema = z.object({
  shareholderName: z.string().min(1, "Shareholder name is required"),
  shareClass: z.string().min(1, "Share class is required"),
  shareholdings: z.string().min(1, "Share holdings is required"),
  numberOfHolders: z.string().min(1, "Number of holders is required")
});

export type ShareholderDetails = z.infer<typeof formSchema>;

interface ShareholderDetailsFormProps {
  onSubmit: (data: ShareholderDetails) => void;
  onPrevious: () => void;
}

export const ShareholderDetailsForm = ({ onSubmit, onPrevious }: ShareholderDetailsFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<ShareholderDetails>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shareholderName: "",
      shareClass: "",
      shareholdings: "",
      numberOfHolders: "1"
    }
  });

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
                <Input placeholder="Enter shareholder name" {...field} />
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
              <FormMessage />
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numberOfHolders"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of holders</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Enter number of holders" 
                  {...field} 
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