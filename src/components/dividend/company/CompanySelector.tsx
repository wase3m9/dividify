
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Building2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CompanySelectorProps {
  onSelect: (companyId: string) => void;
  selectedCompanyId?: string;
  restrictToCompany?: string; // When set, only show this company
}

export const CompanySelector = ({ onSelect, selectedCompanyId, restrictToCompany }: CompanySelectorProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['profile-subscription'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('subscription_plan')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (!profile) throw new Error("Profile not found");

      return profile;
    },
  });

  const { data: companies, isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from('companies')
        .select('id, name')
        .eq('user_id', user.id);
      
      // If restrictToCompany is set, only fetch that specific company
      if (restrictToCompany) {
        query = query.eq('id', restrictToCompany);
      }

      const { data, error } = await query;
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch companies",
        });
        throw error;
      }
      
      return data || [];
    },
  });

  const handleDeleteCompany = async (companyId: string) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId);

      if (error) throw error;

      // If the deleted company was selected, clear the selection
      if (selectedCompanyId === companyId) {
        onSelect('');
      }

      // Invalidate companies query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['companies'] });

      toast({
        title: "Success",
        description: "Company deleted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div>Loading companies...</div>;
  }

  // If user is on starter plan and has exactly one company, show it directly
  if (profile?.subscription_plan === 'starter' && companies && companies.length === 1) {
    const company = companies[0];
    // Automatically select the company if not already selected
    if (!selectedCompanyId) {
      onSelect(company.id);
    }
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-[#9b87f5]" />
          <span className="font-medium">{company.name}</span>
        </div>
      </Card>
    );
  }

  return (
    <Select onValueChange={onSelect} defaultValue={selectedCompanyId}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a company" />
      </SelectTrigger>
      <SelectContent>
        {companies?.map((company) => (
          <SelectItem key={company.id} value={company.id}>
            {company.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
