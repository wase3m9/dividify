import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { CompanySection } from "@/components/dividend/CompanySection";
import { useToast } from "@/hooks/use-toast";

const DividendBoard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

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

          {/* Company Information */}
          <CompanySection 
            company={company}
            onCompanyUpdate={fetchData}
          />

          {/* Quick Actions */}
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="flex-1 p-6 hover:shadow-md transition-shadow">
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

            <Card className="flex-1 p-6 hover:shadow-md transition-shadow">
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
  );
};

export default DividendBoard;