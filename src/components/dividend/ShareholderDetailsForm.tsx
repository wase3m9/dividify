
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCompanyData } from "@/hooks/useCompanyData";
import { useEffect } from "react";
import {
  Form,
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

const shareholderSchema = z.object({
  shareholderName: z.string().min(1, "Shareholder name is required"),
  shareClass: z.string().min(1, "Share class is required"),
  numberOfShares: z.string().min(1, "Number of shares is required"),
  shareholderAddress: z.string().min(1, "Shareholder address is required"),
});

export type ShareholderDetails = z.infer<typeof shareholderSchema>;

interface ShareholderDetailsFormProps {
  onSubmit: (data: ShareholderDetails) => void;
  onPrevious?: () => void;
  selectedCompanyId?: string;
}

export const ShareholderDetailsForm = ({ 
  onSubmit, 
  onPrevious, 
  selectedCompanyId 
}: ShareholderDetailsFormProps) => {
  const { shareholders, selectedCompany } = useCompanyData(selectedCompanyId);
  
  const form = useForm<ShareholderDetails>({
    resolver: zodResolver(shareholderSchema),
    defaultValues: {
      shareholderName: "",
      shareClass: "",
      numberOfShares: "",
      shareholderAddress: "",
    },
  });

  // Pre-populate share class options from existing shareholders
  useEffect(() => {
    if (shareholders && shareholders.length > 0) {
      // Auto-select the first available share class if none is selected
      const firstShareClass = shareholders[0].share_class;
      if (!form.getValues("shareClass") && firstShareClass) {
        form.setValue("shareClass", firstShareClass);
      }
    }
  }, [shareholders, form]);

  const handleSubmit = (data: ShareholderDetails) => {
    onSubmit(data);
  };

  // Get unique share classes from existing shareholders
  const availableShareClasses = shareholders ? 
    Array.from(new Set(shareholders.map(s => s.share_class))) : [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="shareholderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shareholder Name</FormLabel>
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
                <FormLabel>Share Class</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select share class" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableShareClasses.map((shareClass) => (
                        <SelectItem key={shareClass} value={shareClass}>
                          {shareClass}
                        </SelectItem>
                      ))}
                      {availableShareClasses.length === 0 && (
                        <SelectItem value="Ordinary">Ordinary</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numberOfShares"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Shares</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter number of shares" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shareholderAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shareholder Address</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={selectedCompany?.registered_address || "Enter shareholder address"}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between">
          {onPrevious && (
            <Button type="button" variant="outline" onClick={onPrevious}>
              Previous
            </Button>
          )}
          <Button type="submit" className="bg-[#9b87f5] hover:bg-[#8b77e5]">
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
};
