import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  registration_number: z.string().optional(),
  registered_address: z.string().optional(),
  trade_classification: z.string().optional(),
  registered_email: z.string().email().optional().or(z.literal("")),
  incorporation_date: z.string().optional(),
  place_of_registration: z.string().optional(),
  company_category: z.string().optional(),
  trading_on_market: z.boolean().default(false),
  company_status: z.string().default("Active"),
  accounting_category: z.string().optional()
});

type CompanyFormData = z.infer<typeof formSchema>;

interface CompanyFormProps {
  existingCompany?: any;
  onSuccess: () => void;
}

export const CompanyForm = ({ existingCompany, onSuccess }: CompanyFormProps) => {
  const { toast } = useToast();

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: existingCompany?.name || "",
      registration_number: existingCompany?.registration_number || "",
      registered_address: existingCompany?.registered_address || "",
      trade_classification: existingCompany?.trade_classification || "",
      registered_email: existingCompany?.registered_email || "",
      incorporation_date: existingCompany?.incorporation_date || "",
      place_of_registration: existingCompany?.place_of_registration || "",
      company_category: existingCompany?.company_category || "",
      trading_on_market: existingCompany?.trading_on_market || false,
      company_status: existingCompany?.company_status || "Active",
      accounting_category: existingCompany?.accounting_category || ""
    }
  });

  const onSubmit = async (data: CompanyFormData) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("No user found");

      const submissionData = {
        ...data,
        name: data.name, // Explicitly include required field
        user_id: user.id
      };

      const { error } = existingCompany
        ? await supabase
            .from('companies')
            .update(submissionData)
            .eq('id', existingCompany.id)
        : await supabase
            .from('companies')
            .insert([submissionData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Company ${existingCompany ? "updated" : "created"} successfully`,
      });
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        <FormField
          control={form.control}
          name="place_of_registration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Place of Registration</FormLabel>
              <FormControl>
                <Input placeholder="Enter place of registration" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="submit" className="bg-[#9b87f5] hover:bg-[#8b77e5]">
            {existingCompany ? "Update" : "Create"} Company
          </Button>
        </div>
      </form>
    </Form>
  );
};