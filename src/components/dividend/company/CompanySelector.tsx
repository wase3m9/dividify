
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [deletingCompanyId, setDeletingCompanyId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

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

  const handleDeleteCompany = async () => {
    if (confirmationText !== "YES") {
      toast({
        variant: "destructive",
        title: "Invalid Confirmation",
        description: "Please type YES in capital letters to confirm deletion",
      });
      return;
    }

    if (!deletingCompanyId) return;

    try {
      setIsDeleting(true);
      
      // Delete all related data
      const { error: officersError } = await supabase
        .from('officers')
        .delete()
        .eq('company_id', deletingCompanyId);
      
      const { error: shareholdersError } = await supabase
        .from('shareholders')
        .delete()
        .eq('company_id', deletingCompanyId);
      
      const { error: dividendsError } = await supabase
        .from('dividend_records')
        .delete()
        .eq('company_id', deletingCompanyId);
      
      const { error: minutesError } = await supabase
        .from('minutes')
        .delete()
        .eq('company_id', deletingCompanyId);

      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', deletingCompanyId);

      if (error || officersError || shareholdersError || dividendsError || minutesError) {
        throw error || officersError || shareholdersError || dividendsError || minutesError;
      }

      // If the deleted company was selected, clear the selection
      if (selectedCompanyId === deletingCompanyId) {
        onSelect('');
      }

      // Invalidate companies query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['companies'] });

      toast({
        title: "Success",
        description: "Company and all related data deleted successfully",
      });

      setShowDeleteDialog(false);
      setConfirmationText("");
      setDeletingCompanyId(null);
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
    <>
      <div className="flex gap-2">
        <Select onValueChange={onSelect} defaultValue={selectedCompanyId} value={selectedCompanyId}>
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
        {selectedCompanyId && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setDeletingCompanyId(selectedCompanyId);
              setShowDeleteDialog(true);
            }}
            disabled={isDeleting}
            className="hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Company</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p className="text-destructive font-semibold">
                Warning: This will permanently delete all data associated with this company including:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>All dividend vouchers</li>
                <li>All board minutes</li>
                <li>All officers</li>
                <li>All shareholders</li>
              </ul>
              <div className="space-y-2">
                <p className="font-semibold">
                  Type <span className="text-destructive">YES</span> in capital letters to confirm:
                </p>
                <Input
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder="Type YES to confirm"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setConfirmationText("");
              setDeletingCompanyId(null);
            }}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCompany}
              disabled={confirmationText !== "YES" || isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Company"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
