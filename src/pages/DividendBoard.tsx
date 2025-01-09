import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen, Users, Building2 } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { CompanySection } from "@/components/dividend/CompanySection";
import { RecentActivity } from "@/components/dividend/RecentActivity";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ShareholderDetailsForm } from "@/components/dividend/ShareholderDetailsForm";

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
        // Fetch directors
        const { data: directorsData, error: directorsError } = await supabase
          .from('directors')
          .select('*')
          .eq('company_id', companyData.id);

        if (directorsError) throw directorsError;
        setDirectors(directorsData);

        // Fetch shareholdings
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
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Dividend Board</h1>
            <p className="text-gray-600">
              Manage your company information, directors, shareholdings, and dividend vouchers in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left 2 columns */}
            <div className="lg:col-span-2 space-y-8">
              {/* Company Information */}
              <CompanySection 
                company={company}
                onCompanyUpdate={fetchData}
              />

              {/* Directors Section */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#9b87f5]" />
                    <h2 className="text-xl font-semibold">Directors</h2>
                  </div>
                  <Button 
                    variant="outline"
                    className="text-[#9b87f5] border-[#9b87f5]"
                    onClick={() => {/* TODO: Implement director form */}}
                  >
                    Add Director
                  </Button>
                </div>
                {directors.length > 0 ? (
                  <div className="space-y-2">
                    {directors.map((director: any) => (
                      <div key={director.id} className="p-4 border rounded-lg">
                        <p><span className="font-medium">Name:</span> {director.full_name}</p>
                        <p><span className="font-medium">Position:</span> {director.position}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No directors added yet.</p>
                )}
              </Card>

              {/* Shareholdings Section */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-[#9b87f5]" />
                    <h2 className="text-xl font-semibold">Shareholdings</h2>
                  </div>
                  <Dialog open={isShareholderDialogOpen} onOpenChange={setIsShareholderDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline"
                        className="text-[#9b87f5] border-[#9b87f5]"
                      >
                        Add Shareholder
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <ShareholderDetailsForm 
                        onSubmit={handleShareholderSubmit}
                        onPrevious={() => setIsShareholderDialogOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                {shareholdings.length > 0 ? (
                  <div className="space-y-2">
                    {shareholdings.map((shareholding: any) => (
                      <div key={shareholding.id} className="p-4 border rounded-lg">
                        <p><span className="font-medium">Name:</span> {shareholding.shareholder_name}</p>
                        <p><span className="font-medium">Share Class:</span> {shareholding.share_class}</p>
                        <p><span className="font-medium">Number of Shares:</span> {shareholding.number_of_shares}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No shareholdings added yet.</p>
                )}
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Recent Activity */}
              <RecentActivity />

              {/* Quick Actions */}
              <div className="space-y-4">
                <Card className="p-6 hover:shadow-md transition-shadow">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-[#9b87f5]" />
                      <h3 className="text-xl font-semibold">Dividend Vouchers</h3>
                    </div>
                    <p className="text-gray-600">
                      Create and manage dividend vouchers for shareholders.
                    </p>
                    <Button 
                      className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]"
                      onClick={() => navigate("/dividend-voucher/create")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Create Voucher
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 hover:shadow-md transition-shadow">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-6 w-6 text-[#9b87f5]" />
                      <h3 className="text-xl font-semibold">Board Minutes</h3>
                    </div>
                    <p className="text-gray-600">
                      Record and store board meeting minutes for dividend declarations.
                    </p>
                    <Button className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]">
                      <FileText className="h-4 w-4 mr-2" />
                      Create Minutes
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DividendBoard;