
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CompanySelector } from "@/components/dividend/company/CompanySelector";
import { RecentActivity } from "@/components/dividend/RecentActivity";
import { CompanySection } from "@/components/dividend/CompanySection";
import { AuthCheck } from "@/components/dashboard/AuthCheck";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickActions } from "@/components/dashboard/QuickActions";

interface Company {
  id: string;
  name: string;
  registration_number: string | null;
  registered_address: string | null;
}

const AccountantDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not authenticated");
      }
      return user;
    },
    retry: false,
    meta: {
      errorHandler: () => {
        navigate('/auth');
      }
    }
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: selectedCompany } = useQuery({
    queryKey: ['company', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return null;
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', selectedCompanyId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedCompanyId,
  });

  const { data: companies, refetch: refetchCompanies } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };

  const handleCompanyCreated = () => {
    setIsDialogOpen(false);
    refetchCompanies();
  };

  const handleCompanyUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['company', selectedCompanyId] });
  };

  const handleCreateVoucher = () => {
    navigate("/dividend-voucher");
  };

  const handleCreateMinutes = () => {
    navigate("/board-minutes");
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || '';

  return (
    <div className="min-h-screen bg-white">
      <AuthCheck />
      <Navigation />
      <main className="container mx-auto px-4 pt-20">
        <div className="flex flex-col space-y-8">
          <DashboardHeader
            displayName={displayName}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            onCompanyCreated={handleCompanyCreated}
          />

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Select Company</h2>
            <CompanySelector
              onSelect={handleCompanySelect}
              selectedCompanyId={selectedCompanyId}
            />
          </Card>

          {selectedCompanyId && (
            <div className="grid md:grid-cols-2 gap-4">
              <CompanySection 
                company={selectedCompany} 
                onCompanyUpdate={handleCompanyUpdate}
              />

              <QuickActions
                onCreateVoucher={handleCreateVoucher}
                onCreateMinutes={handleCreateMinutes}
              />

              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                {selectedCompanyId && <RecentActivity companyId={selectedCompanyId} />}
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AccountantDashboard;
