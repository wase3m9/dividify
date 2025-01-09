import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { CompanySection } from "@/components/dividend/CompanySection";
import { RecentActivity } from "@/components/dividend/RecentActivity";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/dividend/board/Header";
import { DirectorsSection } from "@/components/dividend/board/DirectorsSection";
import { ShareholdingsSection } from "@/components/dividend/board/ShareholdingsSection";
import { QuickActions } from "@/components/dividend/board/QuickActions";

const DividendBoard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [company, setCompany] = useState(null);
  const [directors, setDirectors] = useState([]);
  const [shareholdings, setShareholdings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isShareholderDialogOpen, setIsShareholderDialogOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        fetchData();
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (companyError) throw companyError;
      setCompany(companyData);

      if (companyData) {
        const { data: directorsData, error: directorsError } = await supabase
          .from('directors')
          .select('*')
          .eq('company_id', companyData.id);

        if (directorsError) throw directorsError;
        setDirectors(directorsData);

        const { data: shareholdingsData, error: shareholdingsError } = await supabase
          .from('shareholdings')
          .select('*')
          .eq('company_id', companyData.id);

        if (shareholdingsError) throw shareholdingsError;
        setShareholdings(shareholdingsData);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShareholderSubmit = async (data: any) => {
    if (!company) return;
    
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('shareholdings')
        .insert([{
          shareholder_name: data.shareholderName,
          share_class: data.shareClass,
          number_of_shares: parseInt(data.shareholdings),
          company_id: company.id,
          user_id: user.id
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Shareholder added successfully",
      });
      setIsShareholderDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto space-y-8">
          <Header companyName={company?.name} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <CompanySection 
                company={company}
                onCompanyUpdate={fetchData}
              />

              <DirectorsSection directors={directors} />

              <ShareholdingsSection 
                shareholdings={shareholdings}
                isDialogOpen={isShareholderDialogOpen}
                onDialogOpenChange={setIsShareholderDialogOpen}
                onSubmit={handleShareholderSubmit}
              />
            </div>

            <div className="space-y-8">
              <RecentActivity />
              <QuickActions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DividendBoard;