import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Pencil } from "lucide-react";
import { CompanyForm } from "./company/CompanyForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Company {
  id: string;
  name: string;
  registration_number: string | null;
  registered_address: string | null;
  registered_email: string | null;
}

interface CompanySectionProps {
  company: Company | null;
  onCompanyUpdate: () => void;
}

export const CompanySection = ({ company, onCompanyUpdate }: CompanySectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    }
  });

  const handleSuccess = () => {
    onCompanyUpdate();
    setIsDialogOpen(false);
  };

  const showEditButton = profile?.subscription_plan === 'enterprise';

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-[#9b87f5]" />
          <h2 className="text-xl font-semibold">Company</h2>
        </div>
        {showEditButton && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 text-[#9b87f5] hover:text-[#8b77e5] hover:bg-[#9b87f5]/10"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <CompanyForm 
                existingCompany={company}
                onSuccess={handleSuccess}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      {company ? (
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div className="text-gray-500">Name:</div>
          <div>{company.name}</div>
          
          <div className="text-gray-500">Registration Number:</div>
          <div>{company.registration_number}</div>
          
          <div className="text-gray-500">Registered Address:</div>
          <div>{company.registered_address}</div>
          
          <div className="text-gray-500">Email Address:</div>
          <div>{company.registered_email || '-'}</div>
        </div>
      ) : (
        <p className="text-gray-500">No company information added yet.</p>
      )}
    </Card>
  );
};