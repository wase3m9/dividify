import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { SiteBreadcrumbs } from "@/components/navigation/SiteBreadcrumbs";
import { CompanySection } from "@/components/dividend/CompanySection";
import { useToast } from "@/hooks/use-toast";
import { useMonthlyUsage } from "@/hooks/useMonthlyUsage";
import { Header } from "@/components/dividend/board/Header";
import { DirectorsSection } from "@/components/dividend/board/DirectorsSection";
import { ShareholdingsSection } from "@/components/dividend/board/ShareholdingsSection";
import { ShareClassesSection } from "@/components/dividend/board/ShareClassesSection";
import { DividendsSection } from "@/components/dividend/board/DividendsSection";
import { MinutesSection } from "@/components/dividend/board/MinutesSection";
import { QuickActions } from "@/components/dividend/board/QuickActions";
import { TipsSection } from "@/components/dividend/dashboard/TipsSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, Mail, CalendarClock, Package } from "lucide-react";
import { CreateBoardPackButton } from "@/components/dividend/boardpack/CreateBoardPackButton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CompanyForm } from "@/components/dividend/company/CompanyForm";
import { Card } from "@/components/ui/card";
import { TrialBanner } from "@/components/dashboard/TrialBanner";
import { PaymentSetupBanner } from "@/components/dashboard/PaymentSetupBanner";
import { MissingBoardMinutesBanner } from "@/components/dashboard/MissingBoardMinutesBanner";
import { DividendAnalyticsSection } from "@/components/dividend/analytics/DividendAnalyticsSection";
import { EmailClientDialog } from "@/components/dividend/email/EmailClientDialog";
import { SentEmailsSection } from "@/components/dividend/email/SentEmailsSection";
import { FeatureRequestPopup } from "@/components/dashboard/FeatureRequestPopup";
import { ScheduleList } from "@/components/dividend/scheduling/ScheduleList";
import { UpcomingDividendsWidget } from "@/components/dividend/scheduling/UpcomingDividendsWidget";


const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const companyIdFromUrl = searchParams.get('companyId');
  const { toast } = useToast();
  const { data: monthlyUsage } = useMonthlyUsage();
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(companyIdFromUrl);
  const [company, setCompany] = useState(null);
  const [directors, setDirectors] = useState([]);
  const [shareholdings, setShareholdings] = useState([]);
  const [shareClasses, setShareClasses] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isShareholderDialogOpen, setIsShareholderDialogOpen] = useState(false);
  const [isShareClassDialogOpen, setIsShareClassDialogOpen] = useState(false);
  const [isAddCompanyDialogOpen, setIsAddCompanyDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [preSelectedVoucherId, setPreSelectedVoucherId] = useState<string>();
  const [preSelectedMinutesId, setPreSelectedMinutesId] = useState<string>();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        await fetchCompanies();
        await fetchUserProfile();
      }
    };

    checkAuth();
  }, [navigate]);

  // Fetch company data when selectedCompanyId changes
  useEffect(() => {
    if (selectedCompanyId) {
      fetchCompanyData(selectedCompanyId);
    }
  }, [selectedCompanyId]);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('subscription_plan, created_at, logo_url, full_name')
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

  const fetchCompanies = async () => {
    try {
      const { data: companiesData, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');

      if (error) throw error;
      setCompanies(companiesData || []);
      
      // Auto-select first company if none selected and companies exist
      if (!selectedCompanyId && companiesData && companiesData.length > 0) {
        const initialCompanyId = companyIdFromUrl || companiesData[0].id;
        setSelectedCompanyId(initialCompanyId);
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

  const fetchCompanyData = async (companyId: string) => {
    try {
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
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
    }
  };

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };

  const handleCompanyCreated = () => {
    setIsAddCompanyDialogOpen(false);
    fetchCompanies();
  };

  const refreshData = () => {
    if (selectedCompanyId) {
      fetchCompanyData(selectedCompanyId);
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
      refreshData();
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
      refreshData();
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

  const handleVoucherEmailClick = (recordId: string) => {
    setPreSelectedVoucherId(recordId);
    setPreSelectedMinutesId(undefined);
    setIsEmailDialogOpen(true);
  };

  const handleMinutesEmailClick = (recordId: string) => {
    setPreSelectedMinutesId(recordId);
    setPreSelectedVoucherId(undefined);
    setIsEmailDialogOpen(true);
  };

  const openEmailDialog = () => {
    setPreSelectedVoucherId(undefined);
    setPreSelectedMinutesId(undefined);
    setIsEmailDialogOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isTrialExpired) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 pb-24">
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
      <div className="container mx-auto px-4 pt-24 pb-24">
        <div className="max-w-5xl mx-auto space-y-12">
        <PaymentSetupBanner />
        <TrialBanner />
        {company && (userProfile?.subscription_plan === 'professional' || userProfile?.subscription_plan === 'enterprise') && (
          <MissingBoardMinutesBanner companyId={company.id} />
        )}
          
          {/* Company Selector Section */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
              <h2 className="text-xl font-semibold">Select Company</h2>
              <Dialog open={isAddCompanyDialogOpen} onOpenChange={setIsAddCompanyDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#9b87f5] hover:bg-[#8b77e5]">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Company
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <CompanyForm onSuccess={handleCompanyCreated} />
                </DialogContent>
              </Dialog>
            </div>
            {companies.length > 0 ? (
              <select
                value={selectedCompanyId || ''}
                onChange={(e) => handleCompanySelect(e.target.value)}
                className="w-full p-3 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-muted-foreground">No companies added yet</p>
            )}
          </Card>

          {!company ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">Welcome to Dividify!</h2>
              <p className="text-gray-600 mb-8">Let's start by adding your company details using the button above.</p>
            </div>
          ) : (
            <>
              <Header companyName={company?.name} />
              
              {/* Email Client Button */}
              <Card className="p-4 border-primary/20 bg-primary/5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Email Client</h3>
                      <p className="text-sm text-muted-foreground">
                        Send dividend vouchers and board minutes directly to clients
                      </p>
                    </div>
                  </div>
                  <Button onClick={openEmailDialog}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email Documents
                  </Button>
                </div>
              </Card>

              {/* Board Pack Generator - Professional/Enterprise only */}
              {(userProfile?.subscription_plan === 'professional' || userProfile?.subscription_plan === 'enterprise') && (
                <Card className="p-4 border-primary/20 bg-primary/5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Board Pack Generator</h3>
                        <p className="text-sm text-muted-foreground">
                          Create comprehensive board packs with dividend vouchers, minutes, and cap tables
                        </p>
                      </div>
                    </div>
                    <CreateBoardPackButton 
                      company={company}
                      logoUrl={userProfile?.logo_url}
                      accountantFirmName={userProfile?.full_name}
                    />
                  </div>
                </Card>
              )}

              {/* Upcoming Dividends Widget - Professional/Enterprise only */}
              {(userProfile?.subscription_plan === 'professional' || userProfile?.subscription_plan === 'enterprise') && (
                <UpcomingDividendsWidget companyId={company?.id} />
              )}
              
              <DividendAnalyticsSection
                companyId={company.id} 
                title={`Dividend Tracker - ${company.name}`}
              />
              
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
                    <TabsTrigger 
                      value="scheduling"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#9b87f5] rounded-none px-4 text-sm"
                    >
                      <CalendarClock className="h-4 w-4 mr-1" />
                      Scheduling
                    </TabsTrigger>
                    <TabsTrigger 
                      value="emails"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#9b87f5] rounded-none px-4 text-sm"
                    >
                      Emails
                    </TabsTrigger>
                  </TabsList>
                  <div className="p-6">
                    <TabsContent value="company" className="mt-0">
                      <CompanySection 
                        company={company}
                        onCompanyUpdate={refreshData}
                      />
                      <div className="mt-8 grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-8">
                          <QuickActions />
                          <TipsSection />
                        </div>
                        <div>
                          <UpcomingDividendsWidget companyId={company?.id} />
                        </div>
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
                      <DividendsSection 
                        companyId={company?.id} 
                        onEmailClick={handleVoucherEmailClick}
                      />
                    </TabsContent>
                    <TabsContent value="minutes" className="mt-0">
                      <MinutesSection 
                        companyId={company?.id}
                        onEmailClick={handleMinutesEmailClick}
                      />
                    </TabsContent>
                    <TabsContent value="scheduling" className="mt-0">
                      <ScheduleList companyId={company?.id} />
                    </TabsContent>
                    <TabsContent value="emails" className="mt-0">
                      <SentEmailsSection companyId={company?.id} />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>

              {/* Email Client Dialog */}
              <EmailClientDialog
                open={isEmailDialogOpen}
                onOpenChange={setIsEmailDialogOpen}
                companyId={company?.id}
                companyName={company?.name}
                companyEmail={company?.registered_email}
                preSelectedVoucherId={preSelectedVoucherId}
                preSelectedMinutesId={preSelectedMinutesId}
              />
            </>
          )}
        </div>
      </div>
      <FeatureRequestPopup />
    </div>
  );
};

export default CompanyDashboard;
