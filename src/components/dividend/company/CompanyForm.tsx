import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BasicInfoFields } from "./BasicInfoFields";
import { formSchema, CompanyFormData } from "./types";
import { DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface CompanyFormProps {
  existingCompany?: any;
  onSuccess: () => void;
}

export const CompanyForm = ({ existingCompany, onSuccess }: CompanyFormProps) => {
  const { toast } = useToast();

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      return user;
    },
  });

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: existingCompany?.name || "",
      registration_number: existingCompany?.registration_number || "",
      registered_address: existingCompany?.registered_address || "",
    }
  });

  const onSubmit = async (data: CompanyFormData) => {
    try {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to create a company",
        });
        return;
      }

      const submissionData = {
        ...data,
        name: data.name,
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

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-[#9b87f5]" />
      </div>
    );
  }

  return (
    <>
      <DialogTitle className="text-xl font-semibold mb-4">
        {existingCompany ? "Update" : "Create"} Company
      </DialogTitle>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <BasicInfoFields form={form} />
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              type="submit" 
              className="bg-[#9b87f5] hover:bg-[#8b77e5]"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {existingCompany ? "Update" : "Create"} Company
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};