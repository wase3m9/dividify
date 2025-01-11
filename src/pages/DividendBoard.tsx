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
import { ShareClassesSection } from "@/components/dividend/board/ShareClassesSection";
import { DividendsSection } from "@/components/dividend/board/DividendsSection";
import { MinutesSection } from "@/components/dividend/board/MinutesSection";
import { QuickActions } from "@/components/dividend/board/QuickActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DividendBoard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [company, setCompany] = useState(null);
  const [directors, setDirectors] = useState([]);
  const [shareholdings, setShareholdings] = useState([]);
  const [shareClasses, setShareClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isShareholderDialogOpen, setIsShareholderDialogOpen] = useState(false);
  const [isShareClassDialogOpen, setIsShareClassDialogOpen] = useState(false);

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
        const { data: officersData, error: officersError } = await supabase
          .from('officers')
          .select('*')
          .eq('company_id', companyData.id);

        if (officersError) throw officersError;
        setDirectors(officersData);

        // Fetch shareholders (excluding share classes)
        const { data: shareholdingsData, error: shareholdingsError } = await supabase
          .from('shareholders')
          .select('*')
          .eq('company_id', companyData.id)
          .eq('is_share_class', false);

        if (shareholdingsError) throw shareholdingsError;
        setShareholdings(shareholdingsData);

        // Fetch share classes separately
        const { data: shareClassesData, error: shareClassesError } = await supabase
          .from('shareholders')
          .select('*')
          .eq('company_id', companyData.id)
          .eq('is_share_class', true);

        if (shareClassesError) throw shareClassesError;
        setShareClasses(shareClassesData);
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
        .from('shareholders')
        .insert([{
          shareholder_name: data.shareholderName,
          share_class: data.shareClass,
          number_of_shares: parseInt(data.numberOfShares),
          company_id: company.id,
          user_id: user.id,
          is_share_class: false
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

  const handleShareClassSubmit = async (data: any) => {
    if (!company) return;
    
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('shareholders')
        .insert([{
          share_class: data.shareClass,
          number_of_shares: parseInt(data.numberOfShares),
          number_of_holders: parseInt(data.numberOfHolders),
          company_id: company.id,
          user_id: user.id,
          shareholder_name: `${data.shareClass} Class`,
          is_share_class: true
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Share class added successfully",
      });
      setIsShareClassDialogOpen(false);
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
        <div className="max-w-5xl mx-auto space-y-12">
          <Header companyName={company?.name} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <Tabs defaultValue="company" className="w-full">
                  <TabsList className="w-full justify-between bg-white border-b rounded-none h-12 p-0">
                    <TabsTrigger 
                      value="company" 
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#9b87f5] rounded-none px-4 text-sm"
                    >
                      Company
                    </TabsTrigger>
                    <TabsTrigger 
                      value="officers"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#9b87f5] rounded-none px-4 text-sm"
                    >
                      Officers
                    </TabsTrigger>
                    <TabsTrigger 
                      value="shareholders"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#9b87f5] rounded-none px-4 text-sm"
                    >
                      Shareholders
                    </TabsTrigger>
                    <TabsTrigger 
                      value="share-classes"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#9b87f5] rounded-none px-4 text-sm"
                    >
                      Share Classes
                    </TabsTrigger>
                    <TabsTrigger 
                      value="dividends"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#9b87f5] rounded-none px-4 text-sm"
                    >
                      Dividends
                    </TabsTrigger>
                    <TabsTrigger 
                      value="minutes"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#9b87f5] rounded-none px-4 text-sm"
                    >
                      Minutes
                    </TabsTrigger>
                  </TabsList>
                  <div className="p-6">
                    <TabsContent value="company" className="mt-0">
                      <CompanySection 
                        company={company}
                        onCompanyUpdate={fetchData}
                      />
                      <div className="mt-8">
                        <QuickActions />
                      </div>
                    </TabsContent>
                    <TabsContent value="officers" className="mt-0">
                      <DirectorsSection directors={directors} />
                    </TabsContent>
                    <TabsContent value="shareholders" className="mt-0">
                      <ShareholdingsSection 
                        shareholdings={shareholdings}
                        isDialogOpen={isShareholderDialogOpen}
                        onDialogOpenChange={setIsShareholderDialogOpen}
                        onSubmit={handleShareholderSubmit}
                      />
                    </TabsContent>
                    <TabsContent value="share-classes" className="mt-0">
                      <ShareClassesSection 
                        shareClasses={shareClasses}
                        isDialogOpen={isShareClassDialogOpen}
                        onDialogOpenChange={setIsShareClassDialogOpen}
                        onSubmit={handleShareClassSubmit}
                      />
                    </TabsContent>
                    <TabsContent value="dividends" className="mt-0">
                      <DividendsSection />
                    </TabsContent>
                    <TabsContent value="minutes" className="mt-0">
                      <MinutesSection />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>

            <div className="lg:col-start-3">
              <div className="sticky top-24">
                <RecentActivity />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DividendBoard;