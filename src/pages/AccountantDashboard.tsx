
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle, FileText, ScrollText } from "lucide-react";
import { CompanySelector } from "@/components/dividend/company/CompanySelector";
import { RecentActivity } from "@/components/dividend/RecentActivity";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CompanyForm } from "@/components/dividend/company/CompanyForm";
import { useToast } from "@/hooks/use-toast";

interface Company {
  id: string;
  name: string;
}

const AccountantDashboard = () => {
  const navigate = useNavigate();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please log in to access the accountant dashboard",
        });
        navigate('/auth');
      }
    };

    checkAuth();
  }, [navigate, toast]);

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

  const handleCreateVoucher = () => {
    navigate("/dividend-voucher");
  };

  const handleCreateMinutes = () => {
    navigate("/board-minutes");
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || '';

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="container mx-auto px-4 pt-20">
        <div className="flex flex-col space-y-8">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {displayName}</h1>
              <p className="text-gray-500 mt-1">
                {new Date().toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#9b87f5] hover:bg-[#8b77e5]">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  New Company
                </Button>
              </DialogTrigger>
              <DialogContent>
                <CompanyForm onSuccess={handleCompanyCreated} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Company Selector */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Select Company</h2>
            <CompanySelector
              onSelect={handleCompanySelect}
              selectedCompanyId={selectedCompanyId}
            />
          </Card>

          {/* Actions Section */}
          {selectedCompanyId && (
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
                <div className="space-y-4">
                  <Button
                    onClick={handleCreateVoucher}
                    className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Create Dividend Voucher
                  </Button>
                  <Button
                    onClick={handleCreateMinutes}
                    className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]"
                  >
                    <ScrollText className="w-4 h-4 mr-2" />
                    Create Board Minutes
                  </Button>
                </div>
              </Card>

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
