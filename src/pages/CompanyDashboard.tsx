import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { CompanySection } from "@/components/dividend/CompanySection";
import { RecentActivity } from "@/components/dividend/RecentActivity";
import { useToast } from "@/hooks/use-toast";
import { useMonthlyUsage } from "@/hooks/useMonthlyUsage";
import { Header } from "@/components/dividend/board/Header";
import { DirectorsSection } from "@/components/dividend/board/DirectorsSection";
import { ShareholdingsSection } from "@/components/dividend/board/ShareholdingsSection";
import { ShareClassesSection } from "@/components/dividend/board/ShareClassesSection";
import { DividendsSection } from "@/components/dividend/board/DividendsSection";
import { MinutesSection } from "@/components/dividend/board/MinutesSection";
import { QuickActions } from "@/components/dividend/board/QuickActions";
import { PlanRestrictions } from "@/components/dividend/board/PlanRestrictions";
import { TipsSection } from "@/components/dividend/dashboard/TipsSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CompanyForm } from "@/components/dividend/company/CompanyForm";
import { Card } from "@/components/ui/card";
import { TrialBanner } from "@/components/dashboard/TrialBanner";
import { PaymentSetupBanner } from "@/components/dashboard/PaymentSetupBanner";



const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const companyIdFromUrl = searchParams.get('companyId');
  const { toast } = useToast();
  const { data: monthlyUsage } = useMonthlyUsage();
  const [company, setCompany] = useState(null);
  const [directors, setDirectors] = useState([]);
  const [shareholdings, setShareholdings] = useState([]);
  const [shareClasses, setShareClasses] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isShareholderDialogOpen, setIsShareholderDialogOpen] = useState(false);
  const [isShareClassDialogOpen, setIsShareClassDialogOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        await fetchData();
        await fetchUserProfile();
      }
    };

    checkAuth();
  }, [navigate, companyIdFromUrl]);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('subscription_plan, created_at')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserProfile(profile);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    }
  };


  const calculateTrialDaysLeft = () => {
    if (!userProfile?.created_at || userProfile.subscription_plan !== 'trial') return null;
    
    const createdAt = new Date(userProfile.created_at);
    const now = new Date();
    const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const daysLeft = 7 - daysSinceCreation;
    
    return Math.max(0, daysLeft);
  };

  const trialDaysLeft = calculateTrialDaysLeft();
  const isTrialExpired = trialDaysLeft === 0 && userProfile?.subscription_plan === 'trial';

  const fetchData = async () => {
    try {
      let companyData;
      
      if (companyIdFromUrl) {
        // Load specific company from URL parameter
        const { data, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', companyIdFromUrl)
          .maybeSingle();
        
        if (companyError) throw companyError;
        companyData = data;
      } else {
        // Load first company (existing behavior)
        const { data, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (companyError) throw companyError;
        companyData = data;
      }
      
      setCompany(companyData);

      if (companyData) {
        const { data: officersData, error: officersError } = await supabase
          .from('officers')
          .select('*')
          .eq('company_id', companyData.id);

        if (officersError) throw officersError;
        setDirectors(officersData);

        const { data: shareholdingsData, error: shareholdingsError } = await supabase
          .from('shareholders')
          .select('*')
          .eq('company_id', companyData.id)
          .eq('is_share_class', false);

        if (shareholdingsError) throw shareholdingsError;
        setShareholdings(shareholdingsData);

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

  const handleShareholderSubmit = async (data: any, shareholderId?: string) => {
    if (!company) return;
    
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("No user found");

      const shareholderData = {
        shareholder_name: data.shareholderName,
        share_class: data.shareClass,
        number_of_shares: parseInt(data.numberOfShares),
        address: data.shareholderAddress,
        company_id: company.id,
        user_id: user.id,
        is_share_class: false
      };

      let error;
      
      if (shareholderId) {
        // Update existing shareholder
        const { error: updateError } = await supabase
          .from('shareholders')
          .update(shareholderData)
          .eq('id', shareholderId);
        error = updateError;
      } else {
        // Insert new shareholder
        const { error: insertError } = await supabase
          .from('shareholders')
          .insert([shareholderData]);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: shareholderId ? "Shareholder updated successfully" : "Shareholder added successfully",
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

  const handleUpgradePlan = () => {
    navigate("/#pricing");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isTrialExpired) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-md mx-auto">
            <Card className="p-8 text-center border-red-200 bg-red-50">
              <CreditCard className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-800 mb-4">Trial Expired</h2>
              <p className="text-red-700 mb-6">
                Your 7-day free trial has ended. Please upgrade your subscription to continue using Dividify.
              </p>
              <Button 
                onClick={handleUpgradePlan}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Upgrade Now
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto space-y-12">
        <PaymentSetupBanner />
        <TrialBanner />
          {!company ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">Welcome to Dividify!</h2>
              <p className="text-gray-600 mb-8">Let's start by adding your company details.</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#9b87f5] hover:bg-[#8b77e5]">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Company
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <CompanyForm onSuccess={fetchData} />
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <>
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
                          <div className="mt-8 grid gap-8">
                            <QuickActions />
                            <TipsSection />
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
                            officers={directors}
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
                          <DividendsSection companyId={company?.id} />
                        </TabsContent>
                        <TabsContent value="minutes" className="mt-0">
                          <MinutesSection companyId={company?.id} />
                        </TabsContent>
                      </div>
                    </Tabs>
                  </div>
                </div>

                <div className="lg:col-start-3">
                  <div className="sticky top-24 space-y-6">
                    <PlanRestrictions 
                      currentPlan={monthlyUsage?.plan || 'trial'}
                      currentUsage={{
                        companies: monthlyUsage?.companiesCount || 0,
                        dividends: monthlyUsage?.dividendsCount || 0,
                        minutes: monthlyUsage?.minutesCount || 0
                      }}
                    />
                    {company && <RecentActivity companyId={company.id} />}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
