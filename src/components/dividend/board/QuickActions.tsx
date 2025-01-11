import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, FileText, Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CompanyForm } from "../company/CompanyForm";
import { useState } from "react";

export const QuickActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_plan, companies_count')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const canAddCompany = () => {
    if (!profile) return false;
    
    switch (profile.subscription_plan) {
      case 'starter':
        return (profile.companies_count || 0) < 1;
      case 'professional':
        return (profile.companies_count || 0) < 3;
      case 'enterprise':
        return true;
      default:
        return (profile.companies_count || 0) < 1;
    }
  };

  const getCompanyLimitMessage = () => {
    if (!profile) return "";
    
    switch (profile.subscription_plan) {
      case 'starter':
        return "Starter plan allows 1 company";
      case 'professional':
        return "Professional plan allows 3 companies";
      case 'enterprise':
        return "Enterprise plan allows unlimited companies";
      default:
        return "Trial plan allows 1 company";
    }
  };

  const handleCompanySuccess = async () => {
    setIsDialogOpen(false);
    await refetchProfile();
    window.location.reload();
  };

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled={!canAddCompany()}
              onClick={() => {
                if (!canAddCompany()) {
                  toast({
                    title: "Company limit reached",
                    description: getCompanyLimitMessage(),
                    variant: "destructive"
                  });
                }
              }}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Add Company</DialogTitle>
            <CompanyForm onSuccess={handleCompanySuccess} />
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => navigate("/dividend-voucher")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Dividend Voucher
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => navigate("/board-minutes")}
        >
          <FileText className="mr-2 h-4 w-4" />
          Create Board Minutes
        </Button>
      </div>
    </Card>
  );
};